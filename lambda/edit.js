'use strict'

const url        = require('url')
const bucketName = 'kjd-urls';
const region     = 'us-east-1';
const AWS        = require('aws-sdk')
const S3         = new AWS.S3()


exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let body        = JSON.parse(event.body);
  let longUrl     = body.url || null;
  let key         = body.key || null;

  validate(longUrl)
  .then(function(){
    return keyExists(bucketName, key)
      .then(() => Promise.resolve(true))
      .catch((err) => Promise.reject(err));
  })
  .catch(function(err){
    console.log('key was not found - abort!');
    callback(null, buildResponse(err.statusCode, err.message));
  })
  .then(function() {
    console.log('updating object!', key, longUrl);
    return updateMeta(key, longUrl);
  })
  .then(function(){
    console.log('update successfull!');
    callback(null, buildResponse(200, key + ' updated.', longUrl));
  })
  .catch(function(err){
    console.log('update failed!');
    callback(null, buildResponse(err.statusCode, err.message));
  });
}

function validate (longUrl) {
  if (longUrl === '') {
    return Promise.reject({
      statusCode: 400,
      message: 'URL is required'
    })
  }

  let parsedUrl = url.parse(longUrl)
  if (parsedUrl.protocol === null || parsedUrl.host === null) {
    return Promise.reject({
      statusCode: 400,
      message: 'URL is invalid'
    })
  }

  return Promise.resolve(longUrl)
}


function updateMeta (key, longUrl) {
  return S3.putObject({
      'Bucket': bucketName,
      'Key': key,
      'WebsiteRedirectLocation': longUrl 
    })
    .promise()
    .then((data) => Promise.resolve(data))
    .catch((err) => Promise.reject(err) );
}

function buildResponse (statusCode, message, url = false) {
  let body = { message }

  if (url) {
    body['url'] = url
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: statusCode,
    body: JSON.stringify(body)
  }
}

function keyExists(bucketName, key) {
  return S3.headObject({
    Bucket: bucketName,
    Key: key
  })
  .promise()
  .then(function(data){ // key found
    console.log('object was found!');
    return Promise.resolve(true);
  })
  .catch(function(err){ // key not found or error
    console.log('object not found!');
    return Promise.reject(err);
  });
}