var ListItem = Vue.component('listItem', {
  props: ['alias', 'endpoint'],
  data: function() {
    return {}
  },
  computed: {
  },
  methods: {
    deleteObject: function(){
      console.log(this.alias.Key, this.endpoint + '/delete');
      // let xhttp    = new XMLHttpRequest();
      // let url      = this.endpoint + '/delete';
      // var data     = JSON.stringify({ key: this.alias.Key });
      // xhttp.onload = this.updateAliasList;
      // xhttp.open('POST', url, true);
      // xhttp.send(data);
    }
  },
  template: '\
    <li class="list-group-item">\
      <h5 class="entry__alias">{{alias.Key}}</h5>\
      <div class="entry__redirect">{{alias.WebsiteRedirectLocation}}</div>\
      <div class="btn-group" role="group" aria-label="Basic example"> \
        <button v-on:click="deleteObject()" type="button" class="btn btn-danger">Delete</button> \
      </div> \
    </li>\
  ',
});
