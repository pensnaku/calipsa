import Vuex from 'vuex';
import Vue from 'vue';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';
import { formatGame } from '../util/util';
import { GAME_STATUSES, RESPONSE_SOURCE } from '../config/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      isLoggedIn: false,
      token: undefined,
      username: undefined,
      id: undefined,
    },
    games: [],
    currentGameSession: undefined,
    apiHostUrl: process.env.VUE_APP_API_HOST,
  },
  getters: {
    games: (state) => state.games,
    gamesCount: (state) => state.games.length,
    currentSessionResponseCount: (state) => {
      return state.currentGameSession
        ? state.currentGameSession.responses.length
        : 0;
    },
    responses: (state) => {
      return state.currentGameSession ? state.currentGameSession.responses : [];
    },
    user: (state) => state.user,
    currentGameSession: (state) => state.currentGameSession,
  },
  mutations: {
    saveUserData: (state, userData) => {
      state.user = userData;
    },
    updateCurrentGameSession: (state, gameIndex) => {
      if (gameIndex === -1 || state.games.length < 1) {
        return (state.currentGameSession = undefined);
      }
      state.games[gameIndex].hasUpdate = false;
      state.currentGameSession = state.games[gameIndex];
    },

    resetUserData: (state) => {
      state.user = {
        isLoggedIn: false,
        token: undefined,
        username: undefined,
        id: undefined,
      };
    },

    updateUserGamesData: (state, gamesData) => {
      state.games = gamesData;
    },

    pushNewGameToGamesArray: (state, newGame) => {
      state.games.push(formatGame(newGame));
    },

    updateAcceptedGame: (state, index) => {
      state.games[index].status = GAME_STATUSES.ONGOING;
    },

    updateGameWinner: (state, data) => {
      state.games[data.index].winnerId = data.winnerId;
    },

    updateGameChosenWord: function(state, { gameIndex, word }) {
      state.games[gameIndex].chosenWord = word;
      state.games[gameIndex].hasUpdate = true;
    },

    updateCurrentChosenWord: (state, chosenWord) => {
      state.currentGameSession.chosenWord = chosenWord;
    },

    updateGameResponse: (state, { index, response }) => {
      const gameHostID = state.games[index].hostId;
      state.games[index].responses.push({
        text: response.response,
        source:
          response.userID === gameHostID
            ? RESPONSE_SOURCE.HOST
            : RESPONSE_SOURCE.GUEST,
      });
    },
  },
  actions: {
    saveUserData: ({ commit }, userData) => {
      commit('saveUserData', userData);
    },

    resetUserData: ({ commit }) => {
      commit('resetUserData');
    },

    populateUserGames: async function({ commit, state }) {
      try {
        const userGamesResponse = await axios.get(`${state.apiHostUrl}games`, {
          headers: {
            Authorization: `Bearer ${state.user.token}`,
          },
        });

        const responseData = userGamesResponse.data;
        if (responseData.success) {
          const games = responseData.data.games;
          const updatedGames = games.map((game) => formatGame(game));
          updatedGames.reverse();
          commit('updateUserGamesData', updatedGames);
          commit('updateCurrentGameSession', 0);
        }
      } catch (err) {
        //
      }
    },

    pushNewGameToGamesArray: function({ commit }, newGame) {
      commit('pushNewGameToGamesArray', newGame);
    },

    updateCurrentGameSession: ({ commit }, gameIndex) => {
      commit('updateCurrentGameSession', gameIndex);
    },

    updateGameWinner: function({ commit, state }, data) {
      for (let i = 0; i < state.games.length; i += 1) {
        if (state.games[i].gameId === data.gameId) {
          commit('updateGameWinner', { index: i, winnerId: data.winnerId });
        }
      }
    },

    updateGameChosenWord: function({ commit, state }, { gameId, word }) {
      state.games.map((game, index) => {
        if (game.gameId === gameId) {
          commit('updateGameChosenWord', {
            gameIndex: index,
            word,
          });
        }
      });
    },

    updateAcceptedGame: function({ commit, state }, game) {
      for (let i = 0; i < state.games.length; i += 1) {
        if (state.games[i].gameId === game.id) {
          commit('updateAcceptedGame', i);
        }
      }
    },

    updateGameResponse: function({ commit, state }, response) {
      for (let i = 0; i < state.games.length; i += 1) {
        if (state.games[i].gameId === response.gameID) {
          commit('updateGameResponse', { index: i, response });
        }
      }
    },

    updateCurrentChosenWord: function({ commit }, chosenWord) {
      commit('updateCurrentChosenWord', chosenWord);
    },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
