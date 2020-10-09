<template>
  <div class="">
    <div class="card mx-auto col-md-8 p-0 m-0" id="game-card">
      <div class="card-header">
        <div class="alert alert-danger fade show" role="alert" v-if="error">
          <strong>Error:</strong> {{ error }}
        </div>
        <GameHeader />
      </div>
      <div class="card-body h-100" id="game-card-body">
        <div v-if="currentSessionResponseCount > 0 && !gameHasWinner()">
          <Message
            v-for="(response, index) in responses"
            :response="response"
            :key="index"
          />
        </div>
        <div v-else class="align-middle h-100">
          <div v-if="gameHasWinner()" class="jumbotron bg-transparent">
            <h1 v-html="displayResultMessage()"></h1>
          </div>
          <div v-else>
            <h3>No messages sent yet...</h3>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <GameFooter />
      </div>
    </div>
  </div>
</template>
<style scoped>
#game-card {
  min-height: 500px;
  margin-top: 100px !important;
}

#game-card-body {
  max-height: 500px !important;
  overflow: auto;
}
</style>

<script>
import Message from '../components/Message';
import GameHeader from '../components/GameHeader';
import GameFooter from '../components/GameFooter';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'GamePlay',
  data: function() {
    return {
      error: undefined,
    };
  },
  methods: {
    setError: function(error) {
      this.error = error;
    },
    gameHasWinner: function() {
      return this.currentGameSession && this.currentGameSession.winnerId
        ? true
        : false;
    },
    displayResultMessage: function() {
      if (this.gameHasWinner) {
        if (this.currentGameSession.winnerId === this.user.id) {
          return 'Hurray!<br> You have won the game!<br><p style="font-size:100px">&#128079;</p>';
        }
        return 'Oooops!<br> You lost the game!<br><p style="font-size:100px">&#128532;</p>';
      }
      return undefined;
    },
  },
  components: {
    Message,
    GameHeader,
    GameFooter,
  },
  computed: {
    ...mapGetters([
      'currentSessionResponseCount',
      'responses',
      'user',
      'currentGameSession',
    ]),
    ...mapState(['apiHostUrl']),
  },
};
</script>
