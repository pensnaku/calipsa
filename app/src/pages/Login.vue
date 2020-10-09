<template>
  <div class="card mx-auto col-sm-12 col-md-5" id="form-card">
    <div class="card-header container-fluid">
      <h4 class="text-center">Login</h4>
    </div>
    <div class="card-body">
      <form @submit.prevent="login">
        <div class="form-group">
          <div class="alert alert-warning text-center" role="alert" v-if="data">
            {{ data }}
          </div>
          <label for="username">Username</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            id="username"
            required
            aria-describedby="username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            v-model="password"
            required
            class="form-control"
            id="password"
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
  name: 'Login',
  components: {},
  data: function() {
    return {
      username: undefined,
      password: undefined,
      data: undefined,
    };
  },
  created: function() {
    if (this.isUserLoggedIn) {
      this.$router.push('/home');
    }
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state) => state.user.isLoggedIn,
      apiHostUrl: 'apiHostUrl',
    }),
  },
  methods: {
    login: async function() {
      this.data = undefined;
      try {
        const response = await axios.post(`${this.apiHostUrl}auth/login`, {
          username: this.username,
          password: this.password,
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
