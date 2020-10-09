<template>
  <div class="card mx-auto col-sm-12 col-md-5" id="form-card">
    <div class="card-header container-fluid">
      <h4 class="text-center">Register</h4>
    </div>
    <div class="card-body">
      <form @submit.prevent="register">
        <div class="form-group">
          <div class="alert alert-warning text-center" role="alert" v-if="data">
            {{ data }}
          </div>
          <label for="username">Username</label>
          <input
            type="text"
            v-model="username"
            required
            class="form-control"
            id="username"
            aria-describedby="usernameHelp"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            required
            v-model="password"
            class="form-control"
            id="password"
          />
        </div>

        <div class="form-group">
          <label for="password">Confirm Password</label>
          <input
            type="password"
            required
            class="form-control"
            v-model="confirmPassword"
            id="confirmPassword"
          />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'Register',
  components: {},
  data: function() {
    return {
      username: undefined,
      password: undefined,
      confirmPassword: undefined,
      data: undefined,
    };
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state) => state.user.isLoggedIn,
      apiHostUrl: 'apiHostUrl',
    }),
  },
  methods: {
    register: async function() {
      this.data = undefined;
      try {
        const url = `${this.apiHostUrl}auth/register`;
        const response = await axios.post(url, {
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });

        const responseData = response.data;
        if (responseData.success) {
          const { user, token } = responseData.data;
          this.updateUserData({
            username: user.username,
            token,
            isLoggedIn: true,
            id: user.id,
          });
          this.$router.push('/home');
        }
      } catch (err) {
        this.data = err.response.data.error;
      }
    },
    updateUserData: function(userData) {
      this.$store.dispatch('saveUserData', userData);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
