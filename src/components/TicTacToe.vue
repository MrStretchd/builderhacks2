<template>
    <div>
        <h2 id="message">
            {{getText()}}
        </h2>
        <div id="board">
            <div class="row" v-for="(row,rowI) in gameData.board" :v-key="row">
                <div class="box" v-for="(box,boxI) in row" :v-key="box" @click="makePlay(rowI,boxI)"> 
                    <svg class="box-type" viewBox="0 0 24 24" v-if="box == 1">
                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>

                    <svg class="box-type" viewBox="0 0 24 24" v-else-if="box == 2">
                        <path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>

                    <svg class="box-type" viewBox="0 0 24 24" v-else>

                    </svg>
                    
                </div>
            </div>
        </div>
        </div>
</template>

<script>
export default {
    name: 'TicTacToe',
    props: {
        gameData: Object,
        connection: WebSocket,
        player: Number,
    },
    methods: {
        getText() {
            if (this.gameData.turn == this.player) {
                return "Waiting for your move.."
            } else {
                return "Waiting for your opponent's move.."
            }
        },
        makePlay(rowI,boxI) {
            if (this.gameData.board[rowI][boxI] == 0) {
                this.connection.send(JSON.stringify({"action":"play","loc":{"row":rowI,"column":boxI}}))
            } 
            
        },
    },
}
</script>

<style scoped>
#message {
    color: var(--foreground);
    text-align: center;
}
#board {
    margin: 0 auto;
    margin-top: 5vh;
}
@media (max-width: 700px){
    #board {
        width: 80%;
    }
}
@media (min-width: 700px){
    #board {
        width:40%;
    }   
}
.row {
    margin: 0;
    width: 100%;
    height: 33.33%;
    border: 1px solid var(--foreground);
    display: flex;
}
.box {
    height: 100%;
    width: 33.33%;
    border: 1px solid var(--foreground);
    color: var(--foreground);
    cursor: pointer;
}
.box-type {
    
}
</style>