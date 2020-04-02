const express = require('express');
const createAlias = require('./routes/createAlias.js');
const deleteAlias = require('./routes/deleteAlias.js');
const editAlias = require('./routes/editAlias.js');
const searchForAlias = require('./routes/searchForAlias.js');
const listAliases = require('./routes/listAliases.js');
const countKeys = require('./routes/countKeys');

const { DB_HOST, DB_NAME } = process.env;
const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.end('nothing to see here')
  })
  .post((req, res) => {
    res.end('nothing to see here')
  });

router.route('/new')
  .post((req, res) =>{
    createAlias(req)
      .then((status) => {
        res.end(JSON.stringify(status));
      })
      .catch((err) => {
        res.end(JSON.stringify(err));
      });
  });

router.route('/delete')
  .post((req, res) =>{
    deleteAlias(req)
      .then((status) => {
        res.end(JSON.stringify(status));
      })
  });

router.route('/edit')
  .post((req, res) =>{
    editAlias(req)
      .then((status) => {
        res.end(JSON.stringify(status));
      })
      .catch((err) => {
        res.end(JSON.stringify(err));
      });
  });

router.route('/list')
  .post((req, res) => {
    listAliases(req)
      .then((status) => {
        res.end(JSON.stringify(status));
      })
      .catch((err) => {
        res.end(JSON.stringify(err));
      });
  })
  .get((req, res) =>{
    listAliases(req)
      .then((status) => {
        res.end(JSON.stringify(status));
      })
      .catch((err) => {
        res.end(JSON.stringify(err));
      });
  });

router.route('/getTotal')
  .get((req, res) => {
    countKeys()
      .then((count) => {
        res.end(JSON.stringify(count));
      })
      .catch((err) => {
        res.end(JSON.stringify(err));
      });
  });

router.route('/search')
  .post((req, res) =>{
    searchForAlias.searchForAlias(body, callback);
  });

/**
 * This array is used to match the endpoint path. Each entry contains
 * the route to match, the methods we allow, the function to run,
 * the collection name to query on (if applicable)
 */
module.exports = router;