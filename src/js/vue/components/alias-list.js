var AliasList = Vue.component('aliasList', {
  props: ['endpoint'],
  data: function() {
    return {
      aliases: [],
      marker: null
    }
  },
  computed: {
  },
  methods: {
    updateAliasList: function(response){
      if (response.target.readyState !== 4 || response.target.status !== 200) {
        return false;
      }
      var response = JSON.parse(response.target.response);
      this.marker = response.marker;
      
      this.aliases = response.results;
    },
    fetchMoreAliases: function(){
      var xhttp    = new XMLHttpRequest();
      var args     = this.marker ? '?marker=' + this.marker : '';
      var url      = this.endpoint + '/list' + args;
      xhttp.onload = this.updateAliasList;
      xhttp.open('GET', url, true);
      xhttp.send();
    }
  },
  created: function() {
    this.fetchMoreAliases();
  },
  template: '\
  <ul class="list-group">\
    <list-item v-for="(alias, key) in aliases" \
      v-bind:alias="alias" \
      v-bind:endpoint="endpoint"\
    />\
    <button v-on:click.prevent="fetchMoreAliases()" class="btn btn-primary">Load More</button>\
  </ul>\
  ',
});
