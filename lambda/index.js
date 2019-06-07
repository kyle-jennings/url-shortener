'use strict'

const url        = require('url');
const bucketName = process.env.BUCKET_NAME;
const AWS        = require('aws-sdk');
const S3         = new AWS.S3();
const baseURL    = null;

const createAlias = require('./modules/createAlias.js');
const deleteAlias = require('./modules/deleteAlias.js');
const editAlias = require('./modules/editAlias.js');
const searchForAlias = require('./modules/searchForAlias.js');
const listAliases = require('./modules/listAliases.js');

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const body = JSON.parse(event.body);
  const path = event.path;

  
  if (path === '/delete') {
    deleteAlias.deleteAlias(body, callback);
  } else if (path === '/edit') {
    editAlias.editAlias(body, callback);
  } else if(path === '/new') {
    createAlias.createAlias(body, callback);
  } else if (path === '/list') {
    listAliases.listAliases(body, callback);
  } else if (path === '/search') {
    searchForAlias.searchForAlias(body, callback);
  } 
  
  let returnBody = {};
  returnBody['status'] = 'success';
  returnBody['path']   = path
  return {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200,
    body: JSON.stringify(returnBody)
  }
}
