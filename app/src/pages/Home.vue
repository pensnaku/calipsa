<template>
  <div class="container-fluid w-100 h-100">
    <div class="row">
      <section class="col-md-3 p-0 m-0" id="actions-section">
        <h4 class="header">ALL GAMES</h4>
        <ul class="list-group w-100 p-0 m-0">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-on:click.prevent="updateCurrentGameSession(-1)"
          >
            <strong>New Game</strong>
            <span class="badge badge-primary badge-pill">+</span>
          </li>
          <div v-if="gamesCount > 0">
            <li
              v-for="(game, index) in games"
              :key="index"
              v-on:click.prevent="updateCurrentGameSession(index)"
              :class="setActiveGameTab(game.gameId)"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ formatUsername(game.host.username) }} vs
              {{ formatUsername(game.guest.username) }}
              <span
                class="badge badge-warning badge-info"
                v-if="isGamePending(game) || gameHasUpdate(game)"
                >1</span
              >
            </li>
          </div>
        </ul>
      </section>
      <section class="col-md-9">
        <GamePlay />
      </section>
    </div>
  </div>
</template>

<script>
import GamePlay from '../components/GamePlay';
import { mapGetters, mapState } from 'vuex';
import { GAME_STATUSES } from '../config/config';
import { EVENTS } from '../config/config';

export default {
  name: 'Home',
  components: {
    GamePlay,
  },
  created: function() {
    this.$store.dispatch('populateUserGames');
  },
  sockets: {
    connect: function() {
      console.log('socket connected...');
    },
  },
  mounted: function() {
    this.sockets.subscribe(`${EVENTS.NEW_REQUEST}_${this.user.id}`, (data) => {
      this.$store.dispatch('pushNewGameToGamesArray', data);
    });
  },
  methods: {
    formatUsername: function(username) {
      return username === this.user.username ? 'you' : username;
    },

    gameHasUpdate: function(game) {
      return game.hasUpdate;
    },

    setActiveGameTab: function(gameId) {
      if (
        this.currentGameSession &&
        gameId === this.currentGameSession.gameId
      ) {
        return {
          active: true,
        };
      }
      return {};
    },
    updateCurrentGameSession: function(gameIndex) {
      this.$store.dispatch('updateCurrentGameSession', gameIndex);
    },
    isGamePending: function(game) {
      return game.status === GAME_STATUSES.PENDING;
    },

    handleNewWordEvent: function(gameId, newWord) {
      this.$store.dispatch('updateGameChosenWord', {
        gameId,
        word: newWord,
      });
    },

    handleWinnerEvent: function(data) {
      console.log(data);
      this.$store.dispatch('updateGameWinner', data);
    },

    handleNewResponseEvent: function(data) {
      this.$store.dispatch('updateGameResponse', data);
    },

    handleGameAcceptedEvent: function(gameId) {
      this.$store.dispatch('updateAcceptedGame', gameId);
    },

    unsubscribeAllGameEvents: function(game) {
      this.sockets.unsubscribe(`${EVENTS.WORD_UPDATE}_${game.id}`);
      this.sockets.unsubscribe(`${EVENTS.GAME_ACCEPTED}_${game.id}`);
      this.sockets.unsubscribe(`${EVENTS.NEW_RESPONSE}_${game.id}`);
      this.sockets.unsubscribe(`${EVENTS.GAME_ENDED}_${game.id}`);
    },

    subscribeAllGameEvents: function(game) {
      // GAME WORD UPDATED
      this.sockets.subscribe(`${EVENTS.WORD_UPDATE}_${game.gameId}`, (data) => {
        this.handleNewWordEvent(data.gameId, data.word);
      });

      // GAME RESPONSES UPDATED
      this.sockets.subscribe(
        `${EVENTS.NEW_RESPONSE}_${game.gameId}`,
        (data) => {
          this.handleNewResponseEvent(data);
        },
      );

      // GAME WINNER UPDATE
      this.sockets.subscribe(`${EVENTS.GAME_ENDED}_${game.gameId}`, (data) => {
        console.log('Game has ended... .');
        this.handleWinnerEvent(data);
      });

      //GAME REQUEST ACCEPTED
      this.sockets.subscribe(
        `${EVENTS.GAME_ACCEPTED}_${game.gameId}`,
        (gameId) => {
          this.handleGameAcceptedEvent(gameId);
        },
      );
    },
  },
  computed: {
    ...mapGetters(['gamesCount', 'games', 'user', 'currentGameSession']),
    ...mapState(['apiHostUrl']),
  },
  watch: {
    games: function(newGames, oldGames) {
      oldGames.map((game) => {
        this.unsubscribeAllGameEvents(game);
      });
      newGames.map((game) => {
        this.subscribeAllGameEvents(game);
      });
    },
  },
};
</script>

<style scoped>
#actions-section {
  background-color: #f5f5f5;
  padding-right: 20px;
  padding-top: 20px;
  min-height: calc(100vh - 50px);
}

#actions-section li {
  cursor: pointer;
}

#actions-section li:hover {
  color: #f5f5f5;
  background: #0037ff42;
}

.header {
  padding: 10px;
  margin-top: 3px;
}
</style>
