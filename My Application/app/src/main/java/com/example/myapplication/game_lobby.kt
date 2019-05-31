package com.example.myapplication


import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.AlarmClock.EXTRA_MESSAGE
import android.view.View
import android.widget.*
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;


const val server = "http://192.168.2.209:1337"
val socket = IO.socket(server)

class GameLobby : AppCompatActivity() {
    private var username: String = ""
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_game_lobby)
        socket.connect()
            .on(Socket.EVENT_CONNECT ) {println("Connected")}
            .emit("Create Player", username )
        val gameListView = findViewById<LinearLayout>(R.id.lobby_game_list)
        val textView: TextView = findViewById(R.id.textView4)
        this.username = intent.getStringExtra(EXTRA_MESSAGE)
        textView.text = "Welcome $username, Pick an open game to join or create a new one!"


        val lprams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )


        socket.on("Update Room List"){ vals ->
            gameListView.removeAllViewsInLayout()
            val result = vals[0].toString()
            var valarray = result.removeSurrounding("[", "]").split(",").map {it.toString()}

            runOnUiThread {
                for (i in 0 until valarray.size) {
                    val btn = Button(this)
                    btn.id = (i)
                    btn.text = ("Game VS" + valarray[i])
                    btn.layoutParams = (lprams)
//
                    btn.setOnClickListener {joinGame(valarray[i].replace("\"",""))}
                    gameListView.addView(btn)
                }
            }
        }
    }


    fun joinGame( gameid: String) {
            val message = arrayOf(gameid,username)
            val intent = Intent(this, PendingGame::class.java).apply {
                putExtra(EXTRA_MESSAGE, message)
            }
            socket.emit("Join Room", gameid,username)
            startActivity(intent)
        }
    fun createGame(view:View) {
            val message = arrayOf(username,username)
            val intent = Intent(this, PendingGame::class.java).apply {
                putExtra(EXTRA_MESSAGE, message)

            }
            socket.emit("Create Room", username)
            startActivity(intent)
    }
}
