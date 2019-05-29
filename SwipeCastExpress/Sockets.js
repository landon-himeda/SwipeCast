module.exports = function(server) {
    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log("Socket connection established! User connected.")
        socket.on("Create Player", function(nickname) {
            newPlayer = new Player(nickname);
        });

        socket.on("Create Room", function(roomName) {
            socket.join(roomName);
            console.log(`User created room: ${roomName}`);
            roomList.push(roomName);
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