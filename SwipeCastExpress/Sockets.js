// const Room = require("./Room");
// const Player = require("./Player");

var roomList = [];
// var roomDict = {};

module.exports = function(server) {
    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log("Socket connection established! User connected.");

        socket.on("Create Player", function(nickname) {
            // newPlayer = new Player(nickname);
            socket.emit("Update Room List", roomList);
        });

        socket.on("Create Room", function(roomName, creator) {
            // newRoom = new Room(roomName, creator);
            // roomDict[roomName] = newRoom;
            roomList.push(roomName);
            socket.join(roomName);
            console.log(`User created room: ${roomName}`);
            // console.log(`RoomDict: ${roomDict}`);
            console.log(`RoomList: ${roomList}`);
            io.emit("Update Room List", roomList);
        });

        socket.on("Join Room", function(roomName, joiner) {
            socket.join(roomName);
            for(var i = 0; i < roomList.length; i++){ 
                if (roomList[i] === roomName) {
                    roomList.splice(i, 1); 
                }
            }
            console.log(`User "${joiner}" joined room "${roomName}"`);
            console.log(`Updated room list: ${roomList}`);
            io.to(roomName).emit("Player Joined");
            io.emit("Update Room List", roomList);
        });

        socket.on("Start Game", function(joinedRoom) {
            io.to(joinedRoom).emit("Start Game");
        });
        
        socket.on("Attack", function(joinedRoom, attackType) {
            socket.to(joinedRoom).emit("Attack", attackType);
        });

        socket.on("Defense", function(joinedRoom, defenseType) {
            socket.to(joinedRoom).emit("Defense", defenseType);
        });

        socket.on("Start Over", function(joinedRoom) {
            io.to(joinedRoom).emit("Restart Game");
        });

        socket.on('disconnect', function() {
            console.log("User has disconnected.")
        });
    });
}