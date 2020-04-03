/* eslint-disable no-undef */
require('./modules/setEnv');
const assert = require('assert');
const createAlias = require('../routes/createAlias.js');
const deleteAlias = require('../routes/deleteAlias.js');

function deleteKey(key) {
  const options = {body: { key }};
  deleteAlias(options);
}

describe('create a', function () {

  /**
   * creates a random path to woot.com
   */
  describe('random path', function () {
    let path = null;
    const title = 'should return a string of random letters and numbers';
    const req = {
      body: {
        url: 'https://woot.com',
      },
    }

    before(() => {
      return createAlias(req)
        .then(
          (response) => {
            path = response.path;
            if (path) deleteKey(path);
          },
          (err) => {
            console.log('fail');
          }
        );
    });

    it(title, function () {
      assert.notEqual(path, null);
    });

  });

  /**
   * creates a custom path to woot.com where a short url should NOT already exist
   */
  describe('custom path does not exist', function () {
    let path = null;
    const title = 'should return a string of "foobar" ';
    const req = {
      body: {
        url: 'https://woot.com',
        customAlias: 'foobar',
      },
    }

    before(() => {
      return createAlias(req)
        .then(
          (response) => {
            path = response.path;            
            if (path) deleteKey(path);
          },
          (err) => {
            assert.equal('path', 'foobar');
          }
        );
    });

    it(title, function () {
      assert.equal(path, 'foobar');
    });
  });

  /**
   * creates a custom path to woot.com where a short url should already exist
   */
  // describe('custom path already exist', function () {
  //   let path = null;
  //   const title = 'should return a string of "foobar" ';
  //   const req = {
  //     body: {
  //       url: 'https://woot.com',
  //       customAlias: 'foobar',
  //     },
  //   };

  //   before(() => {
  //     return createAlias(req)
  //       .then(
  //         (response) => {
  //           path = response.path;
  //         },
  //         (err) => {
  //           assert.equal(path, 'foobar');
  //         }
  //       );
  //   });

  //   it(title, function () {
  //     createAlias(req)
  //       .then((response) => {
  //         console.log('this should not run');
  //       })
  //       .catch((err) => {
  //         assert.equal(path, 'foobar');
  //       });
  //   });
  // });

});
