import Notification from '../components/Notification';

export default {
  props: [],
  components: {
    Notification,
  },
  data: function () { 
    return {
      customAliasToggle: false,
      customAlias: null,
      endpoint: '/new',
      noticeActive: false,
      notice: {
        title: null,
        message: null,
        url: null,
      },
      result: {},
      url: null,
    };
  },
  computed: {
    ifCustomAlias: function () {
      if (this.customAliasToggle) {
        return this.customAlias;
      }
      return null;
    },
  },
  methods: {
    cancel: function () {
      this.reset();
    },
    closeThis: function (event) {
      event.target.closest('.message').remove();
    },
    closeNotification: function () {
      this.noticeActive = false;
    },
    gotSeverResponse: function (data) {
      if (data.target.readyState !== 4 || data.target.status !== 200) {
        return false;
      }
      const { response } = data.target;
      this.toggleNotice(response);
      this.reset();
    },
    reset: function () {
      this.url = null;
      this.customAliasToggle = false;
      this.customAlias = null;
    },
    submit: function () {
      const data = JSON.stringify({ url: this.url, customAlias: this.ifCustomAlias });

      const xhttp = new XMLHttpRequest();
      xhttp.responseType = 'json';
      xhttp.onload = this.gotSeverResponse;
      xhttp.open('POST', this.$getEndpoint(this.endpoint), true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.send(data);
    },
    toggleNotice: function (msg) {
      if (!msg) {
        this.notice = {
          message: null,
          status: null,
          title: null,
          url: null,
        };
        this.noticeActive = false;
        return false;
      }
      this.notice = {
        message: msg.message,
        status: msg.status,
        title: msg.status,
        url: this.$redirectURL(msg.path, msg.url),
      };
      this.noticeActive = true;
    },
  },
  template: `
<form>
  <h1 class="title is-3 is-spaced">Shorten a URL</h1>

  <Notification v-if="noticeActive" :args="notice" @closeNotification="closeNotification" />

  <div class="field">
    <label class="label">Long URL</label>
    <div class="control">
    <input class="input" name="url" type="url" v-model="url" autocomplete="off">
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" v-model="customAliasToggle" autocomplete="off">
        Set a custom short url
      </label>
    </div>
  </div>

  <div class="field" v-if="customAliasToggle">
    <label class="label">Custom URL</label>
    <div class="control has-icons-left has-icons-right">
      <input class="input is-success" type="text" placeholder="Text input" v-model="customAlias">
      <span class="icon is-small is-left">
        <i class="fas fa-link"></i>
      </span>
    </div>
  </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" v-on:click.prevent="submit" >Submit</button>
      </div>
      
      <div class="control">
        <button class="button is-link is-light" v-on:click.prevent="cancel" >Cancel</button>
      </div>
    </div>
</form>
  `,
};
