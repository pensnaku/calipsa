<template>
  <div>
    <div
      class="input-group mb-3"
      v-if="
        currentGameSession != undefined &&
          !currentGameSession.chosenWord &&
          isUserHostOfGame() &&
          !isGamePending()
      "
    >
      <input
        type="text"
        class="form-control"
        placeholder="Enter word and click start..."
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
        v-model="chosenWord"
      />
      <div class="input-group-append">
        <button
          v-on:click.prevent="setChosenWord()"
          class="btn-primary rounded-right"
        >
          Start
        </button>
      </div>
    </div>
    <div
      class="input-group mb-3"
      v-else-if="!isGamePending() && canUserRespondNow()"
    >
      <input
        type="text"
        class="form-control"
        placeholder="Send respond"
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
        v-model="response"
      />
      <div class="input-group-append">
        <button
          v-on:click.prevent="respondToGame()"
          class="btn-primary rounded-right"
        >
          Send
        </button>
      </div>
    </div>
    <div class="" v-else>
      <h5 class="text-center">Please wait for response... .</h5>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import {
  GAME_STATUSES,
  RESPONSE_SOURCE,
  VALID_HOST_RESPONSE,
} from '../config/config';
import axios from 'axios';

export default {
  data: function() {
    return {
      requestUsername: undefined,
      error: undefined,
      chosenWord: undefined,
      response: undefined,
    };
  },
  methods: {
    canUserRespondNow: function() {
      if (!this.currentGameSession || !this.currentGameSession.chosenWord) {
        return false;
      }

      const responses = this.currentGameSession.responses;
      if (responses.length > 0) {
        if (
          responses[responses.length - 1].source === RESPONSE_SOURCE.GUEST &&
          !this.isUserHostOfGame()
        ) {
          return false;
        }
        if (
          responses[responses.length - 1].source === RESPONSE_SOURCE.HOST &&
          this.isUserHostOfGame()
        ) {
          return false;
        }
      }

      return true;
    },
    respondToGame: async function() {
      if (!this.response) {
        this.$parent.setError('Please enter a valid response');
        return;
      }

      if (this.isUserHostOfGame()) {
        if (
          !Object.values(VALID_HOST_RESPONSE).includes(
            this.response.toLowerCase(),
          )
        ) {
          this.$parent.setError('Please enter a yes or no response');
          return;
        }
      }
      try {
        const axiosRes = await axios.post(
          `${this.apiHostUrl}games/${this.currentGameSession.gameId}/respond`,
          {
            response: this.response,
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
        this.response = undefined;
      } catch (err) {
        this.$parent.setError(err.response.data.error);
      }
    },
    setChosenWord: async function() {
      if (!this.chosenWord) {
        this.$parent.setError('Please enter a word');
        return;
      }
      await this.updateChosenWord(this.chosenWord);
      this.$store.dispatch('updateCurrentChosenWord', this.chosenWord);
    },
    updateChosenWord: async function(word) {
      try {
        const axiosRes = await axios.patch(
          `${this.apiHostUrl}games/${this.currentGameSession.gameId}/word`,
          {
            word,
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
      } catch (err) {
        this.$parent.setError(err.response.data.error);
      }
    },
    isGamePending: function() {
      return (
        this.currentGameSession &&
        GAME_STATUSES.PENDING === this.currentGameSession.status
      );
    },
    isUserHostOfGame: function() {
      return this.user.id === this.currentGameSession.host.id;
    },
  },
  computed: {
    ...mapGetters(['gamesCount', 'games', 'user', 'currentGameSession']),
    ...mapState({
      isUserLoggedIn: (state) => state.user.isLoggedIn,
      apiHostUrl: 'apiHostUrl',
    }),
    ...mapActions(['updateCurrentChosenWord']),
  },
};
</script>
