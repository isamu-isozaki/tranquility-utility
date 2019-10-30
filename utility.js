let tape = "";
//Read json file and load to tape

let RunTranq = function() {
	let self = this;
	let defaultJson = "hello.json";
	let $jsonName = $("#jsonName")[0];
	let $jsonSubmit = $("#jsonSubmit");
	let $title = $("#title");
	let $stdout = $("#stdout");
	let $clear = $("#clear");
	self.fileName = "";
	self.start = () => {
		startvm();
		start();
	}
	self.askJson = () => {
		//Thanks https://www.w3schools.com/jsref/met_win_prompt.asp
		if(!self.fileName.endsWith("json")) {
			return false;
		}
		$.ajax({
			url: self.fileName, 
			method: 'GET', 
			dataType: 'text', 
			success: (data) => {
				tape = data.split("\'")[1].split("\\").join("");
				try {
					JSON.parse(tape);
				} catch(e) {
					console.log("Invalid JSON");
					return false;
				}
			}
		})
		.done(() => {
			self.start();
			console.log("Successfully loaded data");
			return true;
		})
		.fail((e) => {
			console.log(`Failed loading ${self.fileName}`);
			console.log(`Running ${defaultJson} instead`);
			self.fileName = defaultJson;
			return false;
		});
	};
	self.setTitle = () => {
		//Thanks https://stackoverflow.com/questions/9933662/split-array-into-two-arrays
		let indexOfPeriod = self.fileName.indexOf(".");
		let title = self.fileName.slice(0, indexOfPeriod);
		$title.text(title);
	}
	self.onSubmit = (event) => {
		event.preventDefault();
		console.log(`Submit json file ${$jsonName.value}`);
		if(self.fileName == $jsonName.value)
			return;
		self.fileName = $jsonName.value;
		self.setTitle();
		self.askJson();
		console.assert(gotJson);
		return true;
	}
	self.onClear = (event) => {
		event.preventDefault();
		$stdout.val("");
	}
	self.init = () => {
		console.log("Initializing website");
		self.fileName = $jsonName.value;
		console.log(`Setting initial filename to ${self.fileName}`);
		self.setTitle();
		self.askJson();
		$jsonSubmit.click(self.onSubmit);
		$clear.click(self.onClear);
	}
}


let init = () => {
	let tranq = new RunTranq();
	tranq.init();
}

$(document).ready(init);