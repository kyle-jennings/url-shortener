var Search = Vue.component('Search', {
  props: ['endpoint'],
  data: function() { 
    return {
      url: null,
      customAliasToggle: false,
      customAlias: null,
      newShortCode: null,
    }
  },
  computed: {
  },
  methods: {
    submit: function(){
      var xhttp = new XMLHttpRequest();
      var data  = JSON.stringify({ url: this.url, customAlias: this.ifCustomAlias });
      xhttp.onload = this.createdNew;
      xhttp.open("POST", this.endpoint, true);
      xhttp.send(data);
    }
  },
  template: '\
  <form>\
      <div class="form-group">\
          <label for="custom-alias-toggle">Search by short URL</label>\
          <input class="form-control" name="url" type="url" v-model="url" autocomplete="off">\
      </div>\
      <button type="submit" v-on:click.prevent="submit()" class="btn btn-primary">Search</button>\
  </form>\
  \
  '
});

