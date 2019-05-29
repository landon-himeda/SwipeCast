var express = require("express");
var http = require('http');
var app = express();
const server = app.listen(1337);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/static"));

app.get("/", function (request, response){
    response.render("index");
})

var roomList = [];

require("./Room");
require("./Player");
require("./Sockets")(server);