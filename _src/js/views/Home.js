export default {
  template: `
  <div>
    <h1 class="is-size-1">Welcome!</h1>
    <p class="is-content">
      Well hello, seems you have a really long url that is not easy to remember..well you've
      come to the right place!  Use the links below to shortned a URL or look at the short URLs
      we already have.
    </p>
    <br />
    <div class='buttons'>
      <router-link to="new" class="button is-primary">Shortned a new URL</router-link>
      <router-link to="list" class="button is-link">See all shortned URLs</router-link>
    </div>
  </div>
  `,
};
