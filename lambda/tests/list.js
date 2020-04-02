/* eslint-disable no-undef */

require('./modules/setEnv');
const assert = require('assert');
const createAlias = require('../routes/createAlias.js');
const deleteAlias = require('../routes/deleteAlias.js');
const listAliases = require('../routes/listAliases.js');


let createdPath = null;


function deleteKey(key) {
  const options = { body: { key } };
  deleteAlias(options);
}

describe('list keys', () => {

  describe('1 key exists', function () {
    const title = 'should return array with length of 1';
    let theResults = [];

    before(function() {
      const req = {
        body: {
          url: 'https://woot.com',
        },
      };

      return createAlias(req)
        .then(
          (response) => {
            const { path } = response.body;
            const req = {
              query: {
                marker: null,
              },
            };
            return listAliases(req)
              .then((status) => {
                theResults = status.body.results;
                if (path) deleteKey(path);
              })
              .catch((err) => {
                console.log(err);
                if (path) deleteKey(path);
              });
          },
          (err) => {
            console.log('fail');
          }
        );
    });

    it(title, function () {
      assert.notEqual(theResults.length, 0);
    });
  });

  describe('0 key exists', function() {
    const title = 'should return array with length of 0';
    const req = {
      query: {
        marker: null,
      },
    };

    let theResults = [];
    beforeEach(function () {
      return listAliases(req)
        .then((status) => {
          theResults = status.body.results;
          if (createdPath) deleteKey(createdPath);
        })
        .catch((err) => {
          if (createdPath) deleteKey(createdPath);
        });
    });

    it(title, function () {
      assert.equal(theResults.length, 0);
    });
  });

});
