'use strict'

const url        = require('url')
const bucketName = process.env.BUCKET_NAME;
const AWS        = require('aws-sdk')
const S3         = new AWS.S3();

module.exports.listAliases = (body, callback, event) => {

  let marker = null;
  if( typeof event.queryStringParameters !== "undefined" && event.queryStringParameters ) {
    marker = event.queryStringParameters.marker || null;
  }
  console.log('listing aliases');
  
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