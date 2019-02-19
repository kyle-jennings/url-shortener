'use strict'

const url                  = require('url')
const bucketName           = 'kjd-urls';
const key                  = '04q';
const AWS                  = require('aws-sdk')
AWS.config                 = new AWS.Config();
AWS.config.accessKeyId     = 'AKIAIXW6EXTYLOJLLGQQ';
AWS.config.secretAccessKey = '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';
AWS.config.region          = 'us-east-1';
const S3                   = new AWS.S3();


const newName = 'oglop';
const newURL  = 'https://oglop.com';
s3.copyObject({
  Bucket: bucketName, 
  CopySource: `${bucketName}/${key}`, 
  Key: newName,
  WebsiteRedirectLocation: newURL
 })
.promise()
.then(returnResults)
.catch(returnError);


function returnResults(data) {
  console.log(data);
}

function returnError(err) {
  console.log(data);
}