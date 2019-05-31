// const Room = require("./models/Room");
// const Player = require("./models/Player");

var roomList = [];
var roomDict = {};

module.exports = function(server) {
    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log("Socket connection established! User connected.");

        socket.on("Create Player", function(nickname) {
            // newPlayer = new Player(nickname);
            socket.emit("Update Room List", roomList);
            socket.join("lobby")
        });

        socket.on("Create Room", function(roomName) {
            // newRoom = new Room(roomName, roomName);
            // roomDict[roomName] = newRoom;
            roomList.push(roomName);
            socket.leave("lobby")
            socket.join(roomName);
            console.log(`User created room: ${roomName}`);
            console.log(`RoomDict: ${roomDict}`);
            console.log(`RoomList: ${roomList}`);
            io.to("lobby").emit("Update Room List", roomList);
        });

        socket.on("Join Room", function(roomName, joiner) {
            console.log(roomName,joiner)
            socket.leave("lobby")
            socket.join(roomName)
            roomList.splice( roomList.indexOf(roomName), 1 );
            io.to("lobby").emit("Update Room List", roomList);
            io.to(roomName).emit("Join Room", joiner)
        });
        
        socket.on("Start Game", function(joinedRoom) {
            io.to(joinedRoom).emit("Start Game")
        })

        socket.on("Attack", function(joinedRoom, attackType) {
            socket.to(joinedRoom).emit("Attack", attackType);
        });

        socket.on("Defense", function(joinedRoom, defenseResult) {
            socket.to(joinedRoom).emit("Defense", defenseResult);
        });

        socket.on("Start Over", function(joinedRoom) {
            io.to(joinedRoom).emit("Restart Game");
        });

        socket.on('disconnect', function() {
            console.log("User has disconnected.")
            socket.broadcast.emit()

        });
    });
}