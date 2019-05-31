package com.example.myapplication

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.AlarmClock.EXTRA_MESSAGE

import android.widget.TextView
import android.widget.Toast

import java.util.*
import kotlin.concurrent.schedule

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
                Toast.makeText(this,"game is starting in 5", Toast.LENGTH_LONG).show()
                player2 = vals[0].toString()
                println(player2)
                pl2View.text = player2
                Timer("Pending",false).schedule(5000){
                    socket.emit("Start Game", player1)
                }
            }
        }
        socket.on("Start Game") {
            runOnUiThread {
                Toast.makeText(this, "GameAboutToStart",Toast.LENGTH_LONG).show()
            }
            val username = intent.getStringArrayExtra(EXTRA_MESSAGE)

            var players = arrayListOf(username[1],player1,player2)
            println(players.toString())
            val intent = Intent(this, GameWindow::class.java).apply {
                putExtra(EXTRA_MESSAGE, players)
            }
            startActivity(intent)
        }
    }


}
