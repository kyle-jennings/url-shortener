var Search = Vue.component('Search', {
  props: ['endpoint'],
  data: function() { 
    return {
      key: null,
      url: null,
      results: {}
    }
  },
  computed: {
  },
  methods: {
    searchComplete: function(data){

    },
    submit: function(searchby, query){
      var search = {};
      search[searchby] = query;
      var xhttp = new XMLHttpRequest();
      var data  = JSON.stringify(search);
      xhttp.onload = this.searchComplete;
      xhttp.open("POST", this.endpoint, true);
      xhttp.send(data);
    }
  },
  template: '\
  <form>\
      <div class="form-group">\
          <label for="custom-alias-toggle">Search by long url</label>\
          <input class="form-control" name="url" type="url" v-model="url" autocomplete="off">\
      </div>\
      <button type="submit" v-on:click.prevent="submit(\'url\', url)" class="btn btn-primary">Search</button>\
      \
      <div class="form-group">\
          <label for="custom-alias-toggle">Search by shortened URL</label>\
          <input class="form-control" name="key" type="key" v-model="key" autocomplete="off">\
      </div>\
      <button type="submit" v-on:click.prevent="submit(\'key\', key)" class="btn btn-primary">Search</button>\
  </form>\
  \
  '
});

