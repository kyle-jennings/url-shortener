/* eslint-disable no-undef */
require('../tests/modules/setEnv');

const assert = require('assert');
const createAlias = require('../routes/createAlias.js');
const sites = require('../tests/modules/sites');
const urls = require('../tests/modules/urls');

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
  console.log(req.body.url);
  createAlias(req)
    .then(response => Promise.resolve(response))
    .catch(response => Promise.reject(response));
});

return Promise.all(promises)
  .then(function (values) {
    theResults = values;
    return Promise.resolve(values);
  });
