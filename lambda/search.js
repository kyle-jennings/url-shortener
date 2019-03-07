'use strict'

const url                  = require('url')
const bucketName           = 'kjd-urls';
const AWS                  = require('aws-sdk')
const S3                   = new AWS.S3();

exports.handler = (event, context, callback) => {

  let body        = JSON.parse(event.body);
  let longUrl     = body.url || null;
  let key         = body.key || null;
  
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
      results: err,
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
