export default {
  props: ['args'],
  data: () => ({}),
  computed: {
    status: function () {
      const classes = {
        fail: 'is-danger',
        success: 'is-success',
      };
      return classes[this.args.status] || null;
    },
    title: function () {
      return this.args.status || null;
    },
    message: function () {
      return this.args.message || null;
    },
    url: function () {
      return this.args.url || null;
    },
  },
  methods: {
    closeNotification: function () {
      this.$emit('closeNotification');
    },
  },
  template: `
  <div class="message" :class="status" >
    <div class="message-header">
      <p>{{title}}</p>
      <button class="delete" aria-label="delete" @click="closeNotification"></button>
    </div>
    <div class="message-body">
      <slot>
        <p v-if="message">{{message}}</p>
        <a v-if="url" :href="url" target="_blank">{{url}}</a>
      </slot>
    </div>
  </div>
`
};
