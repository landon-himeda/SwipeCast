package com.example.myapplication

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.AlarmClock.EXTRA_MESSAGE
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import java.util.*
import kotlin.concurrent.schedule

//const val server2 = "http://192.168.1.150:1337"
//private val socket = IO.socket(server)


class PendingGame : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pending_game)
        var player1 = ""
        var player2 = ""
        val pl1View: TextView = findViewById(R.id.player1name)
        val pl2View: TextView = findViewById(R.id.player2name)
        val message = intent.getStringArrayExtra(EXTRA_MESSAGE)
        player1 = message[0]
        pl1View.text = player1
        socket.on("Join Room") { vals ->

            runOnUiThread {
                Toast.makeText(this,"All Players have joined Starting game in 5 seconds", Toast.LENGTH_LONG).show()
                player2 = vals[0].toString()
                pl2View.text = player2
                Timer("Pending",false).schedule(5000){
                    socket.emit("Start Game")
                }
            }

        }
        socket.on("Start Game") {
            runOnUiThread {
                Toast.makeText(this, "GameAboutToStart",Toast.LENGTH_LONG).show()
            }
        }
    }


}
