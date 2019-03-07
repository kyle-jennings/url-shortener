var NewAlias = Vue.component('newAlias', {
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
    ifCustomAlias: function(){
      if(this.customAliasToggle) {
        return this.customAlias;
      }

      return null;
    }
  },
  methods: {
    createdNew: function(response){
      if (response.target.readyState !== 4 || response.target.status !== 200) {
        return false;
      }
      var response = JSON.parse(response.target.response);
      if(response.url) {
        this.newShortCode = response.url;
      }
    },
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
      <a v-bind:href="newShortCode" class="js-new-shortcode" v-if="newShortCode">{{newShortCode}}</a>\
      <div class="form-group">\
          <label for="url">URL</label>\
          <input class="form-control" name="url" type="url" v-model="url" autocomplete="off">\
          \
          <label for="custom-alias-toggle">Custom</label>\
          <div class="input-group mb-3"> \
            <div class="input-group-prepend"> \
              <div class="input-group-text"> \
                <input name="custom-alias-toggle" type="checkbox" v-model="customAliasToggle" autocomplete="off">\
              </div> \
            </div> \
            <input v-if="customAliasToggle" class="form-control" name="custom-alias" type="text" v-model="customAlias" autocomplete="off">\
            <input class="form-control" type="text" style="width:1px; flex: none; padding: 0;">\
          </div> \
      </div>\
      <button type="submit" v-on:click.prevent="submit()" class="btn btn-primary">Submit</button>\
  </form>\
  '
});

