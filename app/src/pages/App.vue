<template>
  <div id="app">
    <Header />
    <div class="app-body">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';

export default {
  name: 'Login',
  components: {
    Header,
  },
  data: function() {
    return {
      username: undefined,
      password: undefined,
      data: undefined,
    };
  },
  methods: {},
};
</script>
