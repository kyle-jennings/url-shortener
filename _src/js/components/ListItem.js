export default {
  props: ['result'],
  data: () => ({
    alive: true,
    disabled: true,
    newRedirect: null,
  }),
  computed: {
    bucketName: function () {
      return this.result.bucket_name;
    },
    default: function () {
      return `http://${this.bucketName}.s3-website.us-east-1.amazonaws.com/${this.key}`;
    },
    key: function () {
      return this.result.Key;
    },
    redirectURL: function () {
      return this.$redirectURL(this.key, this.default);
    },
    redirect: function () {
      return this.result.WebsiteRedirectLocation;
    },
    link: function () {
      return false;
    },
  },
  methods: {
    cancelEdit: function () {
      this.disabled = true;
      this.newRedirect = this.result.WebsiteRedirectLocation;
    },
    submitEdit: function () {
      const xhttp = new XMLHttpRequest();
      const url = this.$getEndpoint + '/edit';
      const data = JSON.stringify({ key: this.result.Key, url: this.newRedirect });
      xhttp.onload = this.updateItem;
      xhttp.open('POST', url, true);
      xhttp.send(data);
    },
    editObject: function () {
      this.disabled = !this.disabled;
      this.newRedirect = this.result.WebsiteRedirectLocation;
    },
    updateItem: function (data) {
      const res = data.target;
      if (res.status % 200 === 0) {
        const response = JSON.parse(res.response);
        this.result.WebsiteRedirectLocation = response.url;
        this.cancelEdit();
      }
    },
    deleteObject: function () {
      console.log(this.result.Key, this.endpoint + '/delete');
      const xhttp    = new XMLHttpRequest();
      const url      = this.endpoint + '/delete';
      const data     = JSON.stringify({ key: this.result.Key });
      xhttp.onload = this.removeItem;
      xhttp.open('POST', url, true);
      xhttp.send(data);
    },
    removeItem: function (data) {
      const res = data.target;
      const response = res.response;
      if (data.status % 200 === 0) {
        this.alive = false;
      }
    },
  },
  template: `
    <div class="box entry" v-if="alive">
      <h5 class="entry__alias">
        <a class="is-size-4" :href="redirectURL" target="_blank">{{redirectURL}}</a>
      </h5>
      <div class="entry__redirect">
        <a :href="redirect" target="_blank">{{redirect}}</a>
      </div>
      <!-- <div class="entry__redirect"  v-if="!disabled" >
        <input type="url" v-model="newRedirect" /> 
        <button class="badge badge-success" v-on:click="submitEdit()">ok</button>
        <button class="badge badge-warning" v-on:click="cancelEdit()">cancel</button>
      </div>
      <div class="btn-group" role="group"> 
        <button v-on:click="deleteObject()" type="button" class="btn btn-danger">Delete</button> 
        <button v-on:click="editObject()" type="button" class="btn btn-primary">Edit</button> 
      </div>  -->
    </div>  
  `,
};
