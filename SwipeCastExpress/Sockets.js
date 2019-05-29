<<<<<<< HEAD
require("./Player")
=======
const Room = require("./Room");
const Player = require("./Player");

var roomList = [];
var roomDict = {};
>>>>>>> ce051d6fc6fe6093b86de454418a64c31a890c81

module.exports = function(server) {
    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log("Socket connection established! User connected.");

        socket.on("Create Player", function(nickname) {
            newPlayer = new Player(nickname);
<<<<<<< HEAD
            console.log(newPlayer)
=======
            socket.emit("Update Room List", roomList);
>>>>>>> ce051d6fc6fe6093b86de454418a64c31a890c81
        });

        socket.on("Create Room", function(roomName, creator) {
            newRoom = new Room(roomName, creator);
            roomDict[roomName] = newRoom;
            roomList.push(roomName);
            socket.join(roomName);
            console.log(`User created room: ${roomName}`);
            console.log(`RoomDict: ${roomDict}`);
            console.log(`RoomList: ${roomList}`);
            io.emit("Update Room List", roomList);
        });

        socket.on("Join Room", function(roomName, joiner) {

        });
        
        socket.on("Give Damage", function(joinedRoom) {
            socket.to(joinedRoom).emit("Take Damage");
        });

        socket.on("Start Over", function(joinedRoom) {
            io.to(joinedRoom).emit("Restart Game");
        });

        // socket.on('disconnect', function() {
        //     console.log("User has disconnected.")
        //     socket.broadcast.emit()

        // });
    });
}