$(document).ready(function (){
    console.log("Scripts loaded");
    var socket = io();
    var createRoomButton = document.getElementById("createRoomButton");

    var myHealthSpan = document.getElementById("myHealth");
    var opponentsHealthSpan = document.getElementById("opponentsHealth");
    var myHealth = 100;
    var opponentsHealth = 100;
    var incomingAttacks = [];
    var renderedIncomingAttacks = [];
    var outgoingAttacks = [];
    var renderedOutgoingAttacks = [];
    var gameStarted = false;

    function update() {
        $("#roomList").html(roomListHTML);
        console.log(`Room list html: ${roomListHTML}`)

        $(".joinRoomButton").click(function() {
            socket.emit("Join Room", $(this).attr("roomName"), playerName);
            joinedRoom = $(this).attr("roomName");
            $("#createRoomForm").hide();
            $("#roomList").hide();
            $("#roomListHeader").hide();
            $("#waitingRoom").show();
            update();
        });
    }

    function updateGame() {
        $("#myHealth").html(myHealth);
        $("#opponentsHealth").html(opponentsHealth);
    }

    function renderNextAttacks() {
        if (incomingAttacks.length > 0) {
            renderedIncomingAttacks.push({
                "element": `${incomingAttacks.shift()}Attack`,
                "bottom": 0,
                "right": 0
            });
            console.log(`renderedIncomingAttacks: ${renderedIncomingAttacks}`);
        }
        if (outgoingAttacks.length > 0) {
            renderedOutgoingAttacks.push({
                "element": `${outgoingAttacks.shift()}Attack`,
                "bottom": 60,
                "left": 0
            });
            console.log(`renderedOutgoingAttacks: ${renderedOutgoingAttacks}`);
        }
    }

    function moveAttacks() {
        for (var idx = 0; idx < renderedIncomingAttacks.length; idx++) {
            renderedIncomingAttacks[idx].right += 10;
        }
        for (var idx = 0; idx < renderedOutgoingAttacks.length; idx++) {
            renderedOutgoingAttacks[idx].left += 10;
        }
        if (renderedIncomingAttacks.length > 0) {
            if (renderedIncomingAttacks[0].right >= 1000) {
                renderedIncomingAttacks.shift();
                socket.emit("Defense", joinedRoom, "took damage");
                myHealth -= 10;
                if (myHealth <= 0) {
                    gameStarted = false;
                    $("#startOverLose").show();
                    $("#gameSpace").hide();
                }
            }
        }
        
    };

    function drawAttacks() {
        var content = "";
        for (var idx = 0; idx < renderedIncomingAttacks.length; idx++) {
            content += `<div class='${renderedIncomingAttacks[idx].element}Incoming' style='right:${renderedIncomingAttacks[idx].right}px; bottom:${renderedIncomingAttacks[idx].bottom}px'></div>`;
        };
        for (var idx = 0; idx < renderedOutgoingAttacks.length; idx++) {
            content += `<div class='${renderedOutgoingAttacks[idx].element}Outgoing' style='left:${renderedOutgoingAttacks[idx].left}px; bottom:${renderedOutgoingAttacks[idx].bottom}px'></div>`;
        };
        $("#Attacks").html(content);
    }

    var roomListHTML = "";
    var playerName = undefined;
    var joinedRoom = undefined;

    createPlayerButton.addEventListener("click", function() {
        socket.emit("Create Player", $("#createPlayerName").val());
        playerName = $("#createPlayerName").val();
        $("#createPlayerForm").hide();
        $("#createRoomForm").show();
        $("#roomList").show();
        $("#roomListHeader").show();
        update();
    });

    createRoomButton.addEventListener("click", function() {
        socket.emit("Create Room", $("#createRoomName").val(), playerName);
        joinedRoom = $("#createRoomName").val();
        $("#createRoomForm").hide();
        $("#roomList").hide();
        $("#roomListHeader").hide();
        $("#waitingRoom").show();
        update();
    });

    socket.on("Update Room List", function(roomList) {
        roomListHTML = "";
        for (let room of roomList) {
            roomListHTML += `<button class="btn btn-info mb-2 joinRoomButton" roomName="${room}">${room}</button><br>`;
        }
        update();
    });

    socket.on("Join Room", function() {
        $("#waitingForPlayer").hide();
        $("#startGameButton").show();
    });

    document.onkeydown = function(e) {
        if (e.code == "KeyF" && gameStarted) {
            fireAttack();
        }
        else if (e.code == "KeyE" && gameStarted) {
            earthAttack();
        }
        else if (e.code == "KeyW" && gameStarted) {
            waterAttack();
        }
        if (e.code == "KeyJ" && gameStarted) {
            let blockedAttack = renderedIncomingAttacks.shift().element;
            if (blockedAttack === "fireAttack") {
                socket.emit("Defense", joinedRoom, "negated");
            } else if (blockedAttack === "waterAttack") {
                socket.emit("Defense", joinedRoom, "took damage");
                myHealth -= 10;
                if (myHealth <= 0) {
                    gameStarted = false;
                    $("#startOverLose").show();
                    $("#gameSpace").hide();
                }
            } else if (blockedAttack === "earthAttack") {
                socket.emit("Defense", joinedRoom, "reflected");
                opponentsHealth -= 5;
                if (opponentsHealth <= 0) {
                    gameStarted = false;
                    $("#startOverWin").show();
                    $("#gameSpace").hide();
                }
            }
            updateGame();
        }
        else if (e.code == "KeyI" && gameStarted) {
            let blockedAttack = renderedIncomingAttacks.shift().element;
            if (blockedAttack === "fireAttack") {
                socket.emit("Defense", joinedRoom, "took damage");
                myHealth -= 10;
                if (myHealth <= 0) {
                    gameStarted = false;
                    $("#startOverLose").show();
                    $("#gameSpace").hide();
                }
            } else if (blockedAttack === "waterAttack") {
                socket.emit("Defense", joinedRoom, "reflected");
                opponentsHealth -= 5;
                if (opponentsHealth <= 0) {
                    gameStarted = false;
                    $("#startOverWin").show();
                    $("#gameSpace").hide();
                }
            } else if (blockedAttack === "earthAttack") {
                socket.emit("Defense", joinedRoom, "negated");
            }
            updateGame();
        }
        else if (e.code == "KeyO" && gameStarted) {
            let blockedAttack = renderedIncomingAttacks.shift().element;
            if (blockedAttack === "fireAttack") {
                socket.emit("Defense", joinedRoom, "reflected");
                opponentsHealth -= 5;
                if (opponentsHealth <= 0) {
                    gameStarted = false;
                    $("#startOverWin").show();
                    $("#gameSpace").hide();
                }
            } else if (blockedAttack === "waterAttack") {
                socket.emit("Defense", joinedRoom, "negated");
            } else if (blockedAttack === "earthAttack") {
                socket.emit("Defense", joinedRoom, "took damage");
                myHealth -= 10;
                if (myHealth <= 0) {
                    gameStarted = false;
                    $("#startOverLose").show();
                    $("#gameSpace").hide();
                    renderedIncomingAttacks = [];
                    outgoingIncomingAttacks = [];
                }
            }
            updateGame();
        }
    }

    $("#startGameButton").click(function() {
        socket.emit("Start Game", joinedRoom);
        updateGame();
    });

    function fireAttack() {
        outgoingAttacks.push("fire");
        socket.emit("Attack", joinedRoom, "fire");
        updateGame();
    }

    function waterAttack() {
        outgoingAttacks.push("water");
        socket.emit("Attack", joinedRoom, "water");
        updateGame();
    }

    function earthAttack() {
        outgoingAttacks.push("earth");
        socket.emit("Attack", joinedRoom, "earth");
        updateGame();
    }

    $("#fireAttackButton").click(function() {
        outgoingAttacks.push("fire");
        socket.emit("Attack", joinedRoom, "fire");
        updateGame();
    });

    $("#waterAttackButton").click(function() {
        outgoingAttacks.push("water");
        socket.emit("Attack", joinedRoom, "water");
        updateGame();
    });

    $("#earthAttackButton").click(function() {
        outgoingAttacks.push("earth");
        socket.emit("Attack", joinedRoom, "earth");
        updateGame();
    });

    $("#fireDefenseButton").click(function() {
        let blockedAttack = renderedIncomingAttacks.shift().element;
        if (blockedAttack === "fireAttack") {
            socket.emit("Defense", joinedRoom, "negated");
        } else if (blockedAttack === "waterAttack") {
            socket.emit("Defense", joinedRoom, "took damage");
            myHealth -= 10;
            if (myHealth <= 0) {
                gameStarted = false;
                $("#startOverLose").show();
                $("#gameSpace").hide();
            }
        } else if (blockedAttack === "earthAttack") {
            socket.emit("Defense", joinedRoom, "reflected");
            opponentsHealth -= 5;
            if (opponentsHealth <= 0) {
                gameStarted = false;
                $("#startOverWin").show();
                $("#gameSpace").hide();
            }
        }
        updateGame();
    });

    $("#waterDefenseButton").click(function() {
        let blockedAttack = renderedIncomingAttacks.shift().element;
        if (blockedAttack === "fireAttack") {
            socket.emit("Defense", joinedRoom, "reflected");
            opponentsHealth -= 5;
            if (opponentsHealth <= 0) {
                gameStarted = false;
                $("#startOverWin").show();
                $("#gameSpace").hide();
            }
        } else if (blockedAttack === "waterAttack") {
            socket.emit("Defense", joinedRoom, "negated");
        } else if (blockedAttack === "earthAttack") {
            socket.emit("Defense", joinedRoom, "took damage");
            myHealth -= 10;
            if (myHealth <= 0) {
                gameStarted = false;
                $("#startOverLose").show();
                $("#gameSpace").hide();
                renderedIncomingAttacks = [];
                outgoingIncomingAttacks = [];
            }
        }
        updateGame();
    });

    $("#earthDefenseButton").click(function() {
        let blockedAttack = renderedIncomingAttacks.shift().element;
        if (blockedAttack === "fireAttack") {
            socket.emit("Defense", joinedRoom, "took damage");
            myHealth -= 10;
            if (myHealth <= 0) {
                gameStarted = false;
                $("#startOverLose").show();
                $("#gameSpace").hide();
            }
        } else if (blockedAttack === "waterAttack") {
            socket.emit("Defense", joinedRoom, "reflected");
            opponentsHealth -= 5;
            if (opponentsHealth <= 0) {
                gameStarted = false;
                $("#startOverWin").show();
                $("#gameSpace").hide();
            }
        } else if (blockedAttack === "earthAttack") {
            socket.emit("Defense", joinedRoom, "negated");
        }
        updateGame();
    });

    socket.on("Attack", function(attackType) {
        incomingAttacks.push(attackType);
        console.log(`Incoming Attacks: ${incomingAttacks}`)
        updateGame();
    });

    socket.on("Defense", function(defenseResult) {
        if (defenseResult === "took damage") {
            opponentsHealth -= 10;
            if (opponentsHealth <= 0) {
                $("#startOverWin").show();
                $("#gameSpace").hide();
                renderedIncomingAttacks = [];
                outgoingIncomingAttacks = [];
            }
        } else if (defenseResult === "reflected") {
            myHealth -= 5;
            if (myHealth <= 0) {
                $("#startOverLose").show();
                $("#gameSpace").hide();
                renderedIncomingAttacks = [];
                outgoingIncomingAttacks = [];
            }
        }
        renderedOutgoingAttacks.shift();
        updateGame();
    });

    $(".startOverBtn").click(function() {
        socket.emit("Start Over", joinedRoom);
        update();
    });

    socket.on("Restart Game", function() {
        gameStarted = true;
        myHealth = 100;
        opponentsHealth = 100;
        incomingAttacks = [];
        renderedIncomingAttacks = [];
        outgoingAttacks = [];
        renderedOutgoingAttacks = [];
        $("#startOverLose").hide();
        $("#startOverWin").hide();
        $("#gameSpace").show();
        updateGame();
    });

    socket.on("Start Game", function() {
        gameStarted = true;
        myHealth = 100;
        opponentsHealth = 100;
        incomingAttacks = [];
        outgoingAttacks = [];
        $("#waitingRoom").hide();
        $("#gameSpace").show();
        gameLoop();
    });
    function gameLoop() {
        updateGame();
        renderNextAttacks();
        moveAttacks();
        drawAttacks();
        setTimeout(gameLoop, 75);
    }
    update();
});