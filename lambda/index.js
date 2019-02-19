'use strict'

const url                  = require('url')
const bucketName           = 'kjd-urls';
const AWS                  = require('aws-sdk')
AWS.config                 = new AWS.Config();
AWS.config.accessKeyId     = 'AKIAIXW6EXTYLOJLLGQQ';
AWS.config.secretAccessKey = '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';
AWS.config.region          = 'us-east-1';
const S3                   = new AWS.S3();

exports.handler = (event, context, callback) => {

  let lastObject  = null;
  S3.listObjects({
    Bucket: bucketName,
    MaxKeys: 10,
    Marker: lastObject,
  })
  .promise()
  .then(returnResults)
  .catch(returnError);

}

function returnResults(results) {
  results = results.Contents;


  let response = {
    results: results,
    count: results.length,
    marker: results[results.length -1].Key,
  }

  console.log(response);
}

function returnError(err) {
  console.log(err);
}