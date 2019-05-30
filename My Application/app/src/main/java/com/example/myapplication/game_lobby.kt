package com.example.myapplication

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.AlarmClock.EXTRA_MESSAGE
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import kotlinx.android.synthetic.main.activity_game_lobby.*
import java.net.URL


const val server = "http://192.168.1.150:1337"
private val socket = IO.socket(server)
private var gamelistArray = arrayOf(Int)

class GameLobby : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_game_lobby)

        val gameListView = findViewById<LinearLayout>(R.id.lobby_game_list)


//        val gamelistfromserver = URL("http://localhost:3000/").readText()
        val textView: TextView = findViewById(R.id.textView4)

        val message = intent.getStringExtra(EXTRA_MESSAGE)
        textView.text = message
        socket.connect()
            .on(Socket.EVENT_CONNECT ) {println("Connected")}
            socket.emit("Create Player", message )
//        gameListView.adapter = GameListAdapter(this)


        val lprams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )

//        for (i in 0 until gamelistArray.size) {
        for (i in 1..5) {
            val btn = Button(this)
            btn.id=(i + 1)
            btn.text=("Button" + (i + 1))
            btn.layoutParams = (lprams)
            btn.setOnClickListener {joinGame("btn $i")}
            gameListView.addView(btn)
        }

    }
    fun joinGame( gameid: String) {
        val gameid = gameid
        val message:  String =("This is a string")
        val intent = Intent(this, PendingGame::class.java).apply {
            putExtra(EXTRA_MESSAGE, message)
        }
        startActivity(intent)
    }
    fun createGame() {
        val message:  String =("This is a string")
        val intent = Intent(this, PendingGame::class.java).apply {
            putExtra(EXTRA_MESSAGE, message)
        }
    }
}
