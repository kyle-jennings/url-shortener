var ListItem = Vue.component('listItem', {
  props: ['alias', 'endpoint'],
  data: function() {
    return {
      alive: true,
      disabled: true,
      newRedirect: this.alias.WebsiteRedirectLocation
    }
  },
  computed: {
    link: function(){
      return false;
    }
  },
  methods: {
    cancelEdit: function(){
      this.disabled = true;
      this.newRedirect = this.alias.WebsiteRedirectLocation;
    },
    submitEdit: function(){
      console.log('sending ' + this.newRedirect + ' to ' + this.endpoint + '/delete' );
      var xhttp    = new XMLHttpRequest();
      var url      = this.endpoint + '/edit';
      var data     = JSON.stringify({ key: this.alias.Key, url: this.newRedirect });
      xhttp.onload = this.updateItem;
      xhttp.open('POST', url, true);
      xhttp.send(data);
    },
    editObject: function() {
      this.disabled = !this.disabled;
      this.newRedirect = this.alias.WebsiteRedirectLocation;
    },
    updateItem: function(data) {
      var data = data.target;
      if(data.status % 200 === 0) {
        var response = JSON.parse(data.response);
        this.alias.WebsiteRedirectLocation = response.url;
        this.cancelEdit();
      }
    },


    deleteObject: function(){
      console.log(this.alias.Key, this.endpoint + '/delete');
      var xhttp    = new XMLHttpRequest();
      var url      = this.endpoint + '/delete';
      var data     = JSON.stringify({ key: this.alias.Key });
      xhttp.onload = this.removeItem;
      xhttp.open('POST', url, true);
      xhttp.send(data);
    },

    removeItem: function(data) {
      var data = data.target;
      var response = data.response;
      if(data.status % 200 === 0) {
        this.alive = false;
      }
    }
  },
  template: '\
    <li class="list-group-item" v-if="alive">\
      <h5 class="entry__alias">{{alias.Key}}</h5>\
      <div class="entry__redirect">{{alias.WebsiteRedirectLocation}}</div>\
      <div class="entry__redirect"  v-if="!disabled" >\
        <input type="url" v-model="newRedirect" /> \
        <button class="badge badge-success" v-on:click="submitEdit()">ok</button>\
        <button class="badge badge-warning" v-on:click="cancelEdit()">cancel</button>\
      </div>\
      <div class="btn-group" role="group"> \
        <button v-on:click="deleteObject()" type="button" class="btn btn-danger">Delete</button> \
        <button v-on:click="editObject()" type="button" class="btn btn-primary">Edit</button> \
      </div> \
    </li>\
  ',
});
