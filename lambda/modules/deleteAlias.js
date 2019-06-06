'use strict'

const url        = require('url')
const bucketName = process.env.BUCKET_NAME;
const AWS        = require('aws-sdk')
const S3         = new AWS.S3();

module.exports.deleteAlias = (body, callback) => {
  let key  = body.key || null;
  console.log('deleting alias');

  if(!key){
    callback(null, buildResponse(403, 'No key provided, can you try that again?') );
  }

  S3.deleteObject({
    Bucket: bucketName,
    Key: key
  })
  .promise()
  .then(function(response){
    return new Promise(function (resolve, reject) {
      isPathFree(bucketName, key)
      .then(function (isFree) {
        return isFree ? resolve(true) : reject(buildResponse(404, key + ' object was found! deletion failed!'));
      });
    });
  })
  .then(function(data){
    callback(null, buildResponse(200, key + ' was deleted!') );
  })
  .catch(function(err){
    callback(null, buildResponse(err.statusCode, err.message) );
  });

}

function buildResponse (statusCode, message) {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: statusCode,
    body: JSON.stringify({ message })
  }
}


function isPathFree(bucketName, key) {

  return S3.headObject({
    Bucket: bucketName,
    Key: key
  })
  .promise()
  .then(function(data){
    console.log('object was found! deletion failed!');
    return Promise.reject(false);
  })
  .catch(function(err){
    console.log('object not found! deletion success or never there');
    return err.code == 'NotFound' ? Promise.resolve(true) : Promise.reject(false);
  });
}