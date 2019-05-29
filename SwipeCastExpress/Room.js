module.exports =  class Room {
    constructor(roomName, player) {
        this.Name = roomName;
        this.Players = [];
        this.Players.push(player);
        console.log(`New room "${this.Name}" instantiated.`)
        console.log(`Player "${player.Name}" `)
    }

    addPlayer(player) {
        if (this.Players.length < 2) {
            this.Players.push(player);
        }
    }
}