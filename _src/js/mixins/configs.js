export default {
  install: (Vue, args) => {
    const opts = {
      BUCKET_NAME: null,
      DOMAIN: null,
      API: null,
      API_STAGE: null,
      REGION: null,
    };
    const options = {...opts, ...args};

    // properties
    Vue.prototype.BUCKET_NAME = options.BUCKET_NAME || null;
    Vue.prototype.DOMAIN = options.DOMAIN || null;
    Vue.prototype.API = options.API || null;
    Vue.prototype.API_STAGE = options.API_STAGE || null;
    Vue.prototype.REGION = options.REGION || null;
    
    Vue.prototype.$getEndpoint = function (path) {
      return this.API.replace(/\/$/, '') + path;
    };
    
    Vue.prototype.$redirectURL = function (path, provided) {
      if (!path) return provided;
      if (this.DOMAIN) return this.DOMAIN + '/' + path;
      if (this.BUCKET_NAME && this.REGION) return `http://${this.BUCKET_NAME}.s3-website.${this.REGION}.amazonaws.com/${path}`;
      return provided;
    };


  },
};
