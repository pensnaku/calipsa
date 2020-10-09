<template>
  <div>
    <div
      class="input-group mx-auto col-md-10"
      v-if="currentGameSession === undefined"
    >
      <input
        type="text"
        class="form-control"
        v-model="requestUsername"
        placeholder="Enter username to request new game"
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
      />
      <div class="input-group-append">
        <button
          class="btn-primary rounded-right"
          v-on:click.prevent="requestNewGame()"
        >
          Request
        </button>
      </div>
    </div>
    <div
      class="input-group mx-auto col-md-10"
      v-else-if="currentGameSession && isGamePending()"
    >
      <div
        class="alert alert-secondary container-fluid"
        role="alert"
        v-if="isUserHostOfGame()"
      >
        Awaiting acceptance from {{ currentGameSession.guest.username }}
      </div>
      <button
        v-else
        type="button"
        class="btn btn-primary btn-lg btn-block"
        v-on:click.prevent="acceptInvitation()"
        zz
      >
        Accept Invitation from {{ currentGameSession.host.username }}
      </button>
    </div>
    <div class="input-group mx-auto col-md-12" v-else>
      <div
        class="alert alert-secondary container-fluid"
        role="alert"
        v-if="isUserHostOfGame()"
      >
        <h3>Word: {{ currentGameSession.chosenWord }}</h3>
      </div>
      <div v-else class="row container-fluid w-100 p-0 m-0">
        <div class="alert alert-secondary col-md-4" role="alert">
          Question Count:
          <span class="badge badge-primary badge-pill">{{
            questionCount
          }}</span>
        </div>
        <div class="input-group mx-auto col-md-8">
          <div class="input-group mb-3">
            <form class="form-inline" @submit.prevent="guessWord">
              <div class="form-group mx-md-5 mb-2 p-0">
                <label for="answer" class="sr-only">Answer</label>
                <input
                  type="text"
                  v-model="guessedWord"
                  class="form-control w-100"
                  id="answer"
                  placeholder="Guess the word..."
                />
              </div>
              <button type="submit" class="btn btn-info mb-2">
                That's it!
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
#guessword {
  height: 38px !important;
}
</style>
<script>
import { mapGetters, mapState } from 'vuex';
import { GAME_STATUSES, RESPONSE_SOURCE } from '../config/config';
import axios from 'axios';

export default {
  data: function() {
    return {
      requestUsername: undefined,
      error: undefined,
      guessedWord: undefined,
    };
  },
  methods: {
    isGamePending: function() {
      return GAME_STATUSES.PENDING === this.currentGameSession.status;
    },
    isUserHostOfGame: function() {
      return this.user.id === this.currentGameSession.host.id;
    },

    guessWord: async function() {
      try {
        const axiosRes = await axios.post(
          `${this.apiHostUrl}games/${this.currentGameSession.gameId}/guess`,
          {
            word: this.guessedWord,
          },
          {
            headers: {
              Authorization: `Bearer ${this.user.token}`,
            },
          },
        );
        const responseData = axiosRes.data;
        if (!responseData.success) {
          this.$parent.setError(responseData.error);
        }
        this.guessedWord = undefined;
      } catch (err) {
        this.$parent.setError(err.response.data.error);
      }
    },

    acceptInvitation: async function() {
      try {
        const axiosRes = await axios.patch(
          `${this.apiHostUrl}games/${this.currentGameSession.gameId}/accept`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.user.token}`,
            },
          },
        );
        const responseData = axiosRes.data;
        if (!responseData.success) {
          this.$parent.setError(responseData.error);
        }
      } catch (err) {
        this.$parent.setError(err.response.data.error);
      }
    },
    requestNewGame: async function() {
      try {
        const axiosRes = await axios.post(
          `${this.apiHostUrl}games/`,
          {
            guestUsername: this.requestUsername,
          },
          {
            headers: {
              Authorization: `Bearer ${this.user.token}`,
            },
          },
        );
        const responseData = axiosRes.data;
        if (!responseData.success) {
          this.error = responseData.error;
          return;
        }

        this.requestUsername = undefined;
        this.$store.dispatch('pushNewGameToGamesArray', responseData.data.game);
      } catch (err) {
        this.error = err.response.data.error;
      }
    },
  },
  computed: {
    ...mapGetters(['gamesCount', 'games', 'user', 'currentGameSession']),
    ...mapState({
      isUserLoggedIn: (state) => state.user.isLoggedIn,
      apiHostUrl: 'apiHostUrl',
    }),
    questionCount: function() {
      if (!this.currentGameSession) {
        return 0;
      }
      let count = 0;
      for (let i = 0; i < this.currentGameSession.responses.length; i += 1) {
        const res = this.currentGameSession.responses[i];
        count = res.source === RESPONSE_SOURCE.GUEST ? count + 1 : count;
      }

      return count;
    },
  },
};
</script>
