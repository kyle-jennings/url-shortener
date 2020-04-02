export default {
  props: [],
  data: () => ({}),
  computed: {
    links: function () {
      return this.$router.options.routes.filter(x => x.meta && x.meta.navbar);
    },
  },
  template: `
<nav class="navbar">
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item is-neveractive" href="/">URL shortner</a>
    </div>

    <div class="navbar-menu">
        <div class="navbar-start">
          <router-link
            v-for="(link, key) in links"
            class="navbar-link is-arrowless"
            :key="key"
            :to="{name: link.name}">{{link.label}}
          </router-link>
      </div>
    </div>

  </div>
</nav>
  `,
};
