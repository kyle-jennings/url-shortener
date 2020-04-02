// app
import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router';
// modules
import routes from './modules/routes';

//mixins
import correctURL from './mixins/configs';

// components
import Navbar from './components/Navbar';

const data = {
  BUCKET_NAME: __BUCKET_NAME__,
  DOMAIN: __DOMAIN__,
  API: __API__,
  API_STAGE: __API_STAGE__,
  REGION: __REGION__,
};
Vue.use(VueRouter);
Vue.use(correctURL, data);

window.vue = new Vue({
  el: '#vue-app',
  data,
  components: {
    Navbar,
  },
  router: new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    routes,
  }),
  created: function () {
  },
  template: `
  <div>
    <Navbar />
    <div class="section">
      <div class="container">
        <transition name="fade">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
  `,
});
