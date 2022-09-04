<template>
  <div id="page">
      <div id="window">
      <div id="bar"> 
        <h3 v-if="gameData.players[1] && gameData.players[2] == false" id="message">
            Invite your friend: http://localhost:8080/?game_id={{game_id}}
          </h3>
          <h3 v-if="error == 'game'" id="message">
            Invalid game id
          </h3>
          <div id="score" v-if="gameData.players[2] == true"> 
              <div class="counter" >
                  <p class="name text-right">
                      You
                  </p>
                  <p class="score-num text-right">
                      {{gameData.scores[player]}}
                  </p>
              </div>
              <div id="score-divider"> 

              </div>
              <div class="counter">
              <p class="name">
                  Enemy
              </p>
              <p class="score-num text-left">
                  {{gameData.scores[enemy]}}
              </p>
          </div>
          </div>
      </div>
      <div id="game-area">

         <TicTacToe :gameData="gameData" :connection="connection" :player="player" v-if="gameData.players[2]"/>
      </div>
      </div>
  </div>
</template>

<script>
import TicTacToe from '../components/TicTacToe.vue';

export default {
  name: 'HomeView',
  components: {
    TicTacToe,
},
  data() {
      return {
        connection: null,
        game_id: null,
        player: null,
        enemy: null,
        error: null,
        gameData: {
          players: {}
        },
      }
  },
  created() {
    this.connection = new WebSocket("wss://builderhackv2.hop.sh")

    this.connection.onopen = (event) => {
      let game_id = this.$route.query.game_id
      if (!game_id) game_id = null;

      this.connection.send(JSON.stringify({"game_id":game_id, "action":"start"}))
    }

    this.connection.onmessage = (event) => {
      console.log(event.data)
      let data = JSON.parse(event.data)
      

      if (data.action == "gameData") {
        this.$set(this, "gameData", data.gameData)
      } else if (data.action == "start") {
        this.game_id = data.game_id
        this.player = data.player
        if (this.player == 1) {
          this.enemy = 2;
        } else {
          this.enemy = 1;
        }
        this.gameData = data.gameData
      } else if (data.action == "error"){
        this.error = "game"
      }
  }
}
  }
</script>

<style>
body {
  background: var(--background);
  
}
#page {
  display: flex;
  height: 98vh;
  align-items: center;
  justify-content: center;
  
}
#window {
  max-width: 1000px;
  width: 80%;
  margin: 0 auto;
  
}
#bar {
  width: 100%;
  height: 8vh;
  max-width: 1000px;
  margin: 0;
  margin-top: 6.5vh;
  border: 2px solid var(--primary-color); 

  border-radius: 25px 25px 0px 0px;
}
#game-area {
  width: 100%;
  height: 80vh;
  max-width: 1000px;
  max-height: 600px;
  margin: 0;
  border: 2px solid var(--primary-color); 
  border-radius: 0px 0px 25px 25px;

}
#score {
  display: flex;
  justify-content: center;
}
#score-divider {
  height: 7vh;
  width: 3px;
  margin: 0.5vh 0;
  background: var(--foreground);
}
.counter {
  display: block;
  margin-top:1vh;
}
.score-num {
  margin: 0 6px 0 6px;
  height: auto;

  color: var(--foreground);
  font-size: 25px;
  font-weight: 600;
}

.text-left {
  text-align: left;
} 
.text-right {
  text-align: right;
}
.name {
  width: 50px;
  margin: 2px 5px 0px 5px;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);

}
#message {
  color: var(--foreground);
  text-align: center;
  margin-top:3vh;

}
@media (max-width: 800px) {
  #message{
    font-size: 14px;
  }
  
}
</style>