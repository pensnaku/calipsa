<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar navbar-dark bg-primary">
      <a class="navbar-brand" href="#">
        <img src="../assets/images/logo.png" width="30" height="30" alt="" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <ul class="navbar-nav" v-if="isUserLoggedIn">
          <li class="nav-item">
            <a class="nav-link" href="#">Welcome {{ user.username }}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" v-on:click.prevent="logUserOut()" href="#"
              >Logout</a
            >
          </li>
        </ul>
        <ul class="navbar-nav" v-if="!isUserLoggedIn">
          <li class="nav-item">
            <a class="nav-link" href="/login">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/register">Register</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Header',
  props: {
    msg: String,
  },
  methods: {
    logUserOut: function() {
      this.$store.dispatch('resetUserData');
      this.$router.push('/');
    },
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state) => state.user.isLoggedIn,
      user: (state) => state.user,
    }),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
