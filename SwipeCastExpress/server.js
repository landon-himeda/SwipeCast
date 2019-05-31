var express = require("express");
var http = require('http');
var app = express();
const server = app.listen(1337,'192.168.2.209');

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/static"));

app.get("/", function (request, response){
    response.render("index");
});

require("./Sockets")(server);