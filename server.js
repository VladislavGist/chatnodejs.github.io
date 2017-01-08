//модули
var app = require("express")();
var io = require("socket.io").listen(app.listen(8080));

//устанавливаем слой view
app.set("views", __dirname + "/tpl");
app.set("view engine", "jade");
app.engine("jade", require("jade").__express); //магия

//используем статические файлы по такому-то пути
app.use(require("express").static(__dirname + "/public"));

//запрос к express серверу
app.get("/", (req, res) => {
	res.render("page");
});

var users = {};
var getUsers = obj => {
	var tmp = [];
	for(var i in obj) {
		tmp.push(obj[i]);
	}
	return tmp.join(", ");
};

//событие вебсокетов на соеденения
io.sockets.on("connection", (request, res) => {
	request.on("userName", (req, res) => {
		request.emit("message", {text: "--- Добро пожаловать в чат " + req.name + " ---"});
		request.broadcast.emit("message", {text: "--- Пользователь " + req.name + " появился в сети ---"});
		if(Object.keys(users).length > 0) {
			var userList = getUsers(users);
			request.emit("message", {text: "--- Уже в чате " + userList + " ---"});
		} else {
			request.emit("message", {text: "--- В чате только вы ---"});
		}
		users[request.id] = req.name;
	});

	request.on("send", (req, res) => {
		io.sockets.emit("message", {text: req.text});
	});
});