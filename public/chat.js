var socket;

window.onunload = () => {
	socket.disconnect();
};

window.onload = () => {
	socket = io.connect("http://localhost:8080");
	var messages = [],
	content = document.getElementById("content"),
	form = document.getElementById("form"),
	field = document.getElementById("field"),
	submit = document.getElementById("send");

	var userName = prompt("Your name?", "User");
	socket.emit("userName", {name: userName});
	socket.on("message", (req, res) => {
		if(req.text) {
			messages.push(req.text);
			var html = "";
			for(var i = 0; i < messages.length; i++) {
				html += messages[i] + "<br />";
			}
			content.innerHTML = html;
		} else {
			console.log("error");
		}
		
	});

	form.onsubmit = () => {
		var data = field.value;
		socket.emit("send", {text: data});
		field.value = "";
		return false;
	};

};