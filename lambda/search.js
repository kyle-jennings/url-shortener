'use strict'

const url                  = require('url')
const bucketName           = 'kjd-urls';
const AWS                  = require('aws-sdk')
const S3                   = new AWS.S3();

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let body = JSON.parse(event.body);
  let url  = body.url || null;
  let key  = body.key || null;

  if (key) {
    searchForKey(key, callback)
  } else {
    searchForURL(url, callback);
  }

}

function searchForURL(url, callback, marker = null){
  return S3.listObjects({
    Bucket: bucketName,
    MaxKeys: 10,
    Marker: marker,
  })
  .promise()
  .then(collectRedirects)
  .then(function(results){
    results.forEach(function(e,i){
      if (url === e.WebsiteRedirectLocation) {
        console.log('found!');
        callback(null, returnResults(e));
      }
    });
    return results;
  })
  .then(function(results){
    console.log('not found, returning last result');
    results = results[results.length - 1];
    return searchForURL(url, callback, results.Key);
  });
}



function collectRedirects(response){

  var promises = response.Contents.map(function(object){
    return S3.getObject({
      Key: object.Key,
      Bucket: bucketName
    })
    .promise()
    .then(function(result){
      object.WebsiteRedirectLocation = result.WebsiteRedirectLocation;
      return object;
    });
  });
  
  return Promise.all(promises)
  .then(function(values) {
    return Promise.resolve(values);
  });
}

function searchForKey(key, callback){

  S3.getObject({
    Bucket: bucketName,
    Key: key
  })
  .promise()
  .then(function(data){
    callback(null, returnResults(data))
  })
  .catch(function(err){
    callback(null, returnErrorResp(err));
  });

}

function returnErrorResp(err) {
  return {
   statusCode: 404,
   headers: { 
      "Access-Control-Allow-Origin": "*" 
    },
    body: JSON.stringify({
      status: 'fail',
      results: err
    })
  };
}

function returnResults(data) {

  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Origin": "*" 
    },
    body: JSON.stringify({
      status: 'success',
      results: data,
    })
  };
}

function returnError(err) {
  console.log(err);
}
