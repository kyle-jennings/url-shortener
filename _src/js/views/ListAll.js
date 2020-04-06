import ListItem from '../components/ListItem';
import Paginator from '../components/Paginator';

export default {
  props: [],
  data: () => ({
    pages: [],
    batchSize: 100,
    bucketTotal: null,
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
    currentPage: function () {
      const index = this.pages.indexOf(this.results[0].Key);
      return index > -1 ? index : 0; 
    },
    ifFirstPage: function () {
      return this.currentPage === 0;
    },
    ifLastPage: function () {
      return this.currentPage === this.pages.length - 1;
    },
    loadMoreMsg: function () {
      return this.bucketTotal > 0 ? `Load next ${this.batchSize} out of ${this.bucketTotal}` : 'Load more';
    },
    notificationClass: function () {
      return this.totalResults === 0 ? 'is-danger' : 'is-info';
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

        const response = JSON.parse(data.target.response);
        this.marker = response.marker || null;

        if (!response.results) return;
        response.results.forEach((x) => {
          this.results.push(x);
        });
      }, 2000);
    },
    fetchResults: function () {
      const xhr = new XMLHttpRequest();
      const args = '?MaxKeys=' + this.batchSize + (this.marker ? '&marker=' + this.marker : '');
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
        const { response } = data.target;

        this.bucketTotal = response.total;
        this.results = response.firstBatch;
        this.pages = response.batches;
        this.marker = response.batches[1] ? response.batches[1] : null;
      };
      xhr.open('GET', this.$getEndpoint('/get-total'), true);
      xhr.send();
    },
  },
  created: function () {
    this.fetchTotal();
  },
  template: `
  <div>

    <div class="box" v-if="!bucketTotal" >
      <h3 class="is-size-3" >Fetching shortened URLs.</h3>
      <progress class="progress is-small is-primary" max="100">15%</progress>
    </div>
    <div v-else>
      <transition name="fade">
        <div v-if="bucketTotal" class="notification" :class="notificationClass">
          there are {{bucketTotal}} short URLs.
        </div>
      </transition>
      <transition-group name="fade">
        <ListItem
          v-for="(result, key) in results"
          :result="result"
          :key="key"
        />
      </transition-group>
      <br />
      <transition name="fade">
        <button
          class="button is-primary"
          v-if="canLoadMore"
          @click.prevent="fetchResults()"
          >{{loadMoreMsg}}</button>
      </transition>
      </div>
    </div>

  </div>
  `,
};
