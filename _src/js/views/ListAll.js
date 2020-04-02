import ListItem from '../components/ListItem';

export default {
  props: [],
  data: () => ({
    batchSize: 10,
    bucketTotal: 0,
    firstCall: false,
    results: [],
    marker: null,
  }),
  components: {
    ListItem,
  },
  computed: {
    canLoadMore: function () {
      return this.totalResults < this.bucketTotal;
    },
    loadMoreMsg: function () {
      return this.bucketTotal > 0 ? `Load next ${this.batchSize} out of ${this.bucketTotal}` : 'Load more';
    },
    totalResults: function () {
      return this.results.length || null;
    },
  },
  methods: {
    updateResultsList: function (data) {
      if (data.target.readyState !== 4 || data.target.status !== 200) {
        return false;
      }
      setTimeout(() => {
        this.firstCall = true;
        
        const response = JSON.parse(data.target.response);
        this.marker = response.body.marker || null;
  
        if (!response.body.results) return;
        response.body.results.forEach((x) => {
          this.results.push(x);
        });
      }, 2000);
    },
    fetchResults: function () {
      const xhr = new XMLHttpRequest();
      const args = this.marker ? '?marker=' + this.marker : '';
      const url = this.$getEndpoint('/list') + args;
      xhr.onload = this.updateResultsList;
      xhr.open('GET', url, true);
      xhr.send();
    },
    fetchTotal: function () {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.onload = (data) => {
        if (data.target.readyState !== 4 || data.target.status !== 200) {
          return false;
        }

        this.bucketTotal = data.target.response;
      };
      xhr.open('GET', this.$getEndpoint('/getTotal'), true);
      xhr.send();
    },
  },
  beforeMount: function () {
    this.fetchResults();
  },
  created: function () {
    this.bucketTotal = 0;
    this.fetchTotal();
  },
  template: `
  <div>
    <div class="box" v-if="!firstCall" >
      <h3 class="is-size-3" >Fetching shortened URLs.</h3>
      <progress class="progress is-small is-primary" max="100">15%</progress>
    </div>
    <div v-else>
      <div v-if="totalResults">
      <ListItem
        v-for="(result, key) in results" 
        :result="result" 
        :key="key"
      />
      <button 
        class="button is-primary" 
        @click.prevent="fetchResults()"
        v-if="canLoadMore"
        >Load More</button>
      </div>
      <div v-else>
        <h3 class="is-size-3" v-if="firstCall">No shortened URLs have been created.</h3>
      </div>
    </div>
    
  </div>  
  `,
};
