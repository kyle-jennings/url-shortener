/**
 * BASIC Authentication
 *
 * Simple authentication script intended to be run by Amazon Lambda to
 * provide Basic HTTP Authentication for a static website hosted in an
 * Amazon S3 bucket through Couldfront.
 *
 * https://hackernoon.com/serverless-password-protecting-a-static-website-in-an-aws-s3-bucket-bfaaa01b8666
 */
'use strict';

const AWS = require('aws-sdk')
const S3 = new AWS.S3()
const NOT_AUTHED = process.env.NOT_AUTHED || 'https://google.com';
const BUCKET_NAME = process.env.BUCKET_NAME || null;


function getRedirect(Key) {
  return S3.getObject(
    {
      Bucket: BUCKET_NAME, 
      Key,
    }
  )
    .promise()
    .then(data => Promise.resolve(data))
    .catch(err => Promise.resolve(err));
}

exports.handler = (event, context, callback) => {

  // Get request and request headers
  const { request } = event.Records[0].cf;
  const { headers, uri } = request;

  // Configure authentication
  const authUser = 'user';
  const authPass = 'pass';
  const authString = 'Basic ' + new Buffer(authUser + ':' + authPass).toString('base64');

  // some things are permitted to view unauthenticated
  const prohibited = '_admin';
  if (uri !== '/' || uri.indexOf(prohibited) !== 0) {
    callback(null, request);
  }

  // Require Basic authentication
  if (typeof headers.authorization === 'undefined' || headers.authorization[0].value !== authString) {
    const response = {
      status: '401',
      statusDescription: 'Unauthorized',
      body: '<script>window.location.href = "' + NOT_AUTHED + '";</script>',
      headers: {
        'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic' }]
      },
    };
    callback(null, response);
  }

  // Continue request processing if authentication passed
  callback(null, request);
};
