'use strict'

const url                  = require('url')
const bucketName           = 'kjd-urls';
const AWS                  = require('aws-sdk')
const S3                   = new AWS.S3();

exports.handler = (event, context, callback) => {

  let marker = null;
  if( typeof event.queryStringParameters !== "undefined" && event.queryStringParameters ) {
    marker = event.queryStringParameters.marker || null;
  }
  
  S3.listObjects({
    Bucket: bucketName,
    MaxKeys: 10,
    Marker: marker,
  })
  .promise()
  .then(collectRedirects)
  .then(returnResults)
  .catch(returnError)
  .then(function (response) {
    callback(null, response);
  });

}

function returnResults(results) {
  results = results.Contents;
  return Promise.resolve(
  {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Origin": "*" 
    },
    body: JSON.stringify({
      results: results,
      count: results.length,
      marker: results[results.length -1].Key,
    }),
  });
}

function returnError(err) {
  console.log(err);
}


function collectRedirects(response){

  console.log(response);


  response.Contents.forEach(function(e,i,a){
    getObjectRedirect(key);
  });

  return Promise.resolve(response);
}


function getObjectRedirect(key) {
  return S3.getObject({
    Key: key,
    Bucket: bucketName
  }).promise()
  .then(function(result){
    console.log(result);
    Promise.resolve(result);
  })
  .catch();
}


  S3.listObjects({
    Bucket: bucketName,
    MaxKeys: 10,
  })
  .promise()
  .then(collectRedirects)
  .then(returnResults)
  .catch(returnError)
  .then(function (response) {
    console.log('done');
  });
  // results.forEach(function(e,i,a){
  //   S3.getObject({
  //     Key: e.Key,
  //     Bucket: bucketName
  //   }).promise()
  //   .then(
  //     console.log(result)
  //   )
  //   .catch();

  // });