/* eslint-disable no-undef */
require('../modules/setEnv');

const createAlias = require('../../routes/createAlias.js');
const sites = require('../modules/sites');
const urls = require('../modules/urls');


function createRandomUrls () {
  return urls.map((x, i) => {
    return x.replace(/example\.[a-zA-Z]{3}/g, sites[i]);
  });
}

function range(start, end) {
  return [...Array(1 + end - start).keys()].map(v => start + v);
}

const promises = createRandomUrls().map((x) => {
  const req = {
    body: {
      url: x,
    },
  };
  createAlias(req)
    .then(response => Promise.resolve(response))
    .catch(response => Promise.reject(response));
});

return Promise.all(promises)
  .then(function (values) {
    theResults = values;
    return Promise.resolve(values);
  });
