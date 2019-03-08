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
    searchForKey(key)
    .then(function(data){
      callback(null, returnResults(data))
    })
    .catch(function(err){
      callback(null, returnErrorResp(err))
    });
  }

  if (url) {
    searchForURL(url)
    .then(function(data){
      callback(null, returnResults(data))
    })
    .catch(function(err){
      callback(null, returnErrorResp(err))
    });
  }

  callback(null, {
   statusCode: 500,
   headers: { 
      "Access-Control-Allow-Origin": "*" 
    },
    body: JSON.stringify({
      status: 'fail',
      results: 'URL or Key not passed in'
    })
  });
}

/**
 * [searchForURL description]
 * @param  {[type]} url    [description]
 * @param  {[type]} marker [description]
 * @return {[type]}        [description]
 */
function searchForURL(url, marker = null){
  return S3.listObjects({
    Bucket: bucketName,
    MaxKeys: 10,
    Marker: marker,
  })
  .promise()
  .then(collectRedirects)
  .then(checkForURLMatch)
  .then(function(results){
    return Promise.resolve(result);
  })
  .catch(function(marker){
    return searchForURL(url, marker.Key)
  });
}

function checkForURLMatch(results){
  return promises = new Promise(function(resolve, reject){
    results.forEach(function(e,i){
      if (url === e.WebsiteRedirectLocation) {
        console.log('found!');
        return resolve(e);
      }
    });

    var marker = results[results.length - 1];
    return reject(marker);
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

function searchForKey(key){

  return S3.getObject({
    Bucket: bucketName,
    Key: key
  })
  .promise()
  .then(function(data){
    return Promise.resolve(data);
  })
  .catch(function(err){
    return Promise.reject(err);
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
