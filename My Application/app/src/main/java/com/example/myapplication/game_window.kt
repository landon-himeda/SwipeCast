package com.example.myapplication

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.AlarmClock.EXTRA_MESSAGE
import android.widget.Button
import android.widget.ImageButton

import android.widget.TextView
import java.util.*
import kotlin.collections.ArrayList
import kotlin.concurrent.schedule

var attackOutgoing = ArrayList<String>()
var attackIncoming = ArrayList<String>()
var players = ArrayList<String>()

class GameWindow : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_game_window)
        players = intent.getStringArrayListExtra(EXTRA_MESSAGE)
        var myHealthDisplay: TextView = findViewById(R.id.myHealth)
        var myNameDisplay: TextView = findViewById(R.id.myName)
        var myHealthHp = 100
        var opponentHp = 100
        var opponentHealthDisplay : TextView = findViewById(R.id.opponentHealth)
        var opponentNameDisplay: TextView = findViewById(R.id.opponentName)
        var atkBtnFire: ImageButton = findViewById(R.id.fireAttack)
        var atkBtnWater: ImageButton = findViewById(R.id.waterAttack)
        var atkBtnEarth: ImageButton = findViewById(R.id.earthAttack)
        atkBtnFire.setOnClickListener {attackOpponent("fire")}
        atkBtnWater.setOnClickListener {attackOpponent("water")}
        atkBtnEarth.setOnClickListener {attackOpponent("earth")}
        opponentHealthDisplay.text = opponentHp.toString()
        if(players[1] == players[0]){
            opponentNameDisplay.text = players[2]
        } else {
            opponentNameDisplay.text = players[1]
        }
        myHealthDisplay.text = myHealthHp.toString();
        myNameDisplay.text = players[0]
        Timer("Pending",false).schedule(300,1*300){
            if(attackOutgoing.size >0){
                var sendattack = attackOutgoing.removeAt(0)
                socket.emit("Attack", players[1],sendattack)
            }
            atkBtnEarth.isClickable = true
            atkBtnFire.isClickable = true
            atkBtnWater.isClickable = true
        }
    }
    private fun attackOpponent(attack:String) {
        var atkBtnFire: ImageButton = findViewById(R.id.fireAttack)
        var atkBtnWater: ImageButton = findViewById(R.id.waterAttack)
        var atkBtnEarth: ImageButton = findViewById(R.id.earthAttack)


        atkBtnEarth.isClickable = false
        atkBtnFire.isClickable = false
        atkBtnWater.isClickable = false
        attackOutgoing.add(attack)
        println(attackOutgoing)
    }
}
