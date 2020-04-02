require('./modules/setEnv');
const assert = require('assert');
const createAlias = require('../modules/createAlias.js');
const deleteAlias = require('../modules/deleteAlias.js');


describe('delete when', function() {


  describe('key exists', function() {

    let statusCode = null;
    before(function() {
      const req = {
        body: {
          url: 'https://woot.com',
        },
      }
      return createAlias(req)
        .then(
          (response) => {
            const { path } = response.body;
            const options = {body: { key: path }};
        
            return deleteAlias(options)
              .then(
                (response) => {
                  statusCode = response.statusCode;
                },
                (err) => {
                  console.log('fail');
                }
              );
          },
          (err) => {
            console.log('fail');
          }
        );
    });

    const title = 'should return status code of 200';
    it(title, function() {
      assert.equal(statusCode, 200);
    });

  });

  describe('key does not exist', function() {
    let statusCode = null;
    before(() => {
      const req = {body: { key: '___' }};
      return deleteAlias(req)
        .then(
          (response) => {
            statusCode = response.statusCode;
          },
          (err) => {
            console.log('fail');
          }
        );
    });

    const title = 'should return status code of 200';
    it(title, function() {
      assert.equal(statusCode, 200);
    });
  });
});
