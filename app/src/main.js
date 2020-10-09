import Vue from 'vue';
import router from './routes';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/app.css';
import App from '../src/pages/App.vue';
import store from '../src/store/store';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO(process.env.VUE_APP_API_HOST),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
  }),
);
Vue.config.productionTip = false;

new Vue({
  data: {
    currentRoute: window.location.pathname,
    user: {
      name: 'pensnaku',
      id: '',
      token: '',
    },
  },
  router,
  render: (h) => h(App),
  store,
}).$mount('#app');
