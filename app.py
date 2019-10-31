from flask import Flask
import json
from flask import render_template, url_for, redirect, request, jsonify
from flask import url_for
import os
import requests

app = Flask(__name__, template_folder = "./static/templates")
app.config['SECRET_KEY'] = 'secret!'


#Socket io based on https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent

@app.route('/home/<string:userName>', methods = ['GET', 'POST'])
def home(userName):
    newEpisodes = Episodes(userName = userName)
    session.add(newEpisodes)
    session.commit()
    Episodes_id = session.query(Episodes).filter_by(userName = userName).order_by(Episodes.id.desc()).first().id#get last item the one just created
    return render_template('home.html', userName = userName)

@app.route('/')
def root():
    return redirect(url_for("signIn"))
@app.route('/signin', methods = ['GET', 'POST'])
def signIn():
    if request.method == 'POST':
        userName = request.form['username']
        return redirect(url_for("home", userName = userName))
    return render_template('signIn.html')


@socketio.on('requestEmotions')
def getEmotions():
    print("Requesting emotion list")
    emit("getEmotions", {"emotionList": actionList})
@socketio.on('requestAction')
def getAction(data):
    userName = data['userName']
    img_url = data['videoframe']
    encoded_data = img_url.split(',')[1]#Thanks https://stackoverflow.com/questions/54168580/sending-image-from-html-canvas-to-flask-python-not-working
    nparr = np.fromstring(encoded_data.decode('base64'), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    reward = data['reward']
    previsous_id = data['id']
    detected, points = detectPoints(True, img)
    Episodes_id = session.query(Episodes).filter_by(userName = userName).order_by(Episodes.id.desc()).first().id#get last item the one just created
    if detected:

        initial_state = None
        if previsous_id == -1:
            initial_state = np.zeros([num_layers, 2, 1, point_size])
        else:
            init_final_state = session.query(Episode).filter_by(id = previous_id).init_final_state
            init_final_state_json = json.loads(init_final_state)
            initial_state = np.asarray(init_final_state_json["final_state"])

        #payload = {"input": np.reshape([1.0, 2.0], (-1, 1)).tolist()}
        #payload = [{"init_state":np.reshape(initial_state, (2,2,-1,136)).tolist(), "state": np.reshape(points, (-1, 136)).tolist()}]
        #headers = {"content-type": "application/json"}
        #data = json.dumps({"signature_name": "predict", "inputs":payload})
        #r = requests.post('http://model:8501/v1/models/saved_model:predict', json=data, headers=headers)
        #payload = {"init_state":np.reshape(initial_state, (2,2,-1,136)).tolist(),"state": np.reshape(points, (-1, 136)).tolist()}
        #headers = {"content-type": "application/json"}
        #data = json.dumps({"signature_name": "predict", "inputs":payload})
        #r = requests.post('http://model:8501/v1/models/saved_model:predict', json=data, headers=headers)
        #print(r)
        #print(json.loads(r)["error"])

        #payload = [{"state": np.reshape(points, (-1,point_size)).tolist(), "init_state":initial_state.tolist()}]
        payload = [{"init_state":np.reshape(initial_state, (2,2,-1,136)).tolist(), "state": np.reshape(points, (-1,136)).tolist()}]
        headers = {"content-type": "application/json"}
        data = json.dumps({"signature_name": "predict", "instances":payload})
        r = requests.post('http://model:8501/v1/models/saved_model:predict', data=data, headers=headers)
        #payload = {"init_state":np.reshape(initial_state, (2,2,-1,136)).tolist(),"state": np.reshape(points, (-1, 136)).tolist()}
        #headers = {"content-type": "application/json"}
        #data = json.dumps({"signature_name": "predict", "inputs":payload})
        #r = requests.post('http://model:8501/v1/models/saved_model:predict', json=data, headers=headers)
        print(r)
        #print(json.loads(r)["error"])
        """
        pred = json.loads(r)["predictions"]

        action_probs = pred["action_probs"]
        final_state = pred["final_state"]

        initial_final_state_output = json.dumps({"initial_state": np.asarray(initial_state).tolist(), "final_state": final_state})
        action = int(np.random.choice(np.arange(len(action_probs)), p=action_probs))
        old_policy = float(action_probs[action])

        #policy_dict = {"initial_state": initial_state_policy.tolist(), "final_state": final_state_policy.tolist()}
        #policy_json = json.dumps(policy_dict)
        #Upload
        #newEpisode = Episode(points = np.reshape(points, (-1, point_size)), prediction= action, init_final_state_policy = policy_json, \
        #old_policy = old_policy, reward = reward, episodes_id = Episodes_id)
        points_json = json.dumps(np.reshape(points, (-1, point_size)).tolist())
        #newEpisode = Episode(points = points_json, prediction= action, old_policy = old_policy, reward = reward, episodes_id = Episodes_id)
        newEpisode = Episode(points = points_json, prediction= action, old_policy = old_policy, init_final_state = initial_final_state_output, reward = reward, episodes_id = Episodes_id)
        session.add(newEpisode)
        session.flush()
        id = newEpisode.id
        session.commit()
        print("Uploaded to database!")

        output = {'is_videoframe': True, 'action': int(action), 'id': id}
        emit('recievedAction', output)"""
    emit('recievedAction', {'is_videoframe': False})


#@socketio.on('join')
#def join():
#    print("Client joined")
@socketio.on('connect')
def connect():
    print('Client connected')
    #tf.reset_default_graph()#as nginx will be used, and app.run will be ran instead, the tensorflow enviroment will start running here
    #sess =tf.InteractiveSession()
    #if os.path.isfile("/vagrant/model/checkpoint"):
    #    saver.restore(sess, "/vagrant/model/model")



@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')
    #sess.close()

@socketio.on('error')
def error(err):
    print(err);

@socketio.on('message')
def handleMessage(msg):
    print(msg)
if __name__ == "__main__":
    app.host='127.0.0.1'
    app.debug=True
    app.port=5000
    app.run(host = '127.0.0.1', debug = True)
    #Thanks https://medium.com/@arnab.k/how-to-keep-processes-running-after-ending-ssh-session-c836010b26a3
