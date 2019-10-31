let tape = "";
//Read json file and load to tape

let RunTranq = function() {
	let self = this;
	let defaultJson = "hello.json";
	let $jsonName = $("#jsonName");
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
				self.start();
				console.log("Successfully loaded data");
				return true;
			}
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
		//Also set textbox input value
		let indexOfPeriod = self.fileName.indexOf(".");
		let title = self.fileName.slice(0, indexOfPeriod);
		$title.text(title);
	}
	self.onSubmit = (event) => {
		event.preventDefault();
		console.log(`Submit json file ${$jsonName[0].value}`);
		if(self.fileName == $jsonName[0].value)
			return;
		self.fileName = $jsonName[0].value;
		self.setTitle();
		self.askJson();
		return true;
	}
	self.onClear = (event) => {
		event.preventDefault();
		$stdout.val("");
	}
	self.getFile = () => {
		//Thanks https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
		let params = new window.URLSearchParams(window.location.search);
		self.fileName = params.get("f")
	}
	self.getURLName = () => {
		let url = window.location.href;
		let htmlName = url.split("/");
		htmlName = htmlName[htmlName.length-1];
		htmlName = htmlName.split(".html")[0];
		$jsonName.val(htmlName+".json");
		defaultJson = htmlName+".json";
		self.fileName = defaultJson;
	}
	self.init = () => {
		console.log("Initializing website");
		console.log("Gettind JSON of f variable if specified");
		self.getURLName();
		self.getFile();
		if(self.fileName == null) {
			self.fileName = $jsonName[0].value;
		} else {
			$jsonName.val(self.fileName);
		}
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