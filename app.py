from flask import Flask
import json
from flask import render_template, url_for, redirect, request, jsonify
from flask import url_for
import os
import requests
import subprocess

app = Flask(__name__, template_folder = "./static/templates")
app.config['SECRET_KEY'] = 'secret!'


@app.route('/tranq_code/<string:fileName>', methods = ['GET', 'POST'])
def tranq_code(fileName):
    if request.method == 'POST':
        code = request.form['code']
        tranq_file = fileName+".t"
        json_file = fileName+".json"
        output = None
        try:
            with open(tranq_file, "w+") as f:
                f.write(code)
            subprocess.run(["tranqc", tranq_file])
            #Thanks https://stackoverflow.com/questions/89228/calling-an-external-command-from-python

            with open(json_file) as f:
                output = f.read()
            return output
        except Exception as e:
            print(f"{e}. tranq file: {tranq_file}. json file: {json_file}. code: {code}")
            return "error"
    return render_template('tranq_code.html', fileName = fileName)

@app.route('/tranq_json/<string:fileName>', methods = ['GET', 'POST'])
def tranq_json(fileName):
    return render_template('tranq_json.html', fileName = fileName)

@app.route('/')
def root():
    return redirect(url_for("setFile"))
@app.route('/setFile', methods = ['GET', 'POST'])
def setFile():
    if request.method == 'POST':
        fileName = request.form['fileName']
        url = request.form['url']
        return redirect(url_for(url, fileName = fileName))
    return render_template('setFile.html')

if __name__ == "__main__":
    app.host='127.0.0.1'
    app.debug=True
    app.port=5000
    app.run(host = '127.0.0.1', debug = True)
    #Thanks https://medium.com/@arnab.k/how-to-keep-processes-running-after-ending-ssh-session-c836010b26a3
