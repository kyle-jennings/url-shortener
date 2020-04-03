const AWS = require('aws-sdk');

const { BUCKET_NAME } = process.env;
const S3 = new AWS.S3();
const MaxKeys = 10;

function getMarker(results) {
  return results[results.length - 1].Key;
}


function returnResults(results) {
  return Promise.resolve({
    statusCode: 200,
    results: results,
    count: results.length,
    marker: results[results.length - 1].Key,
  });
}

function returnError(err) {
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: err,
  });
}


/**
 * Adds the S3 redirect to each retrieved object
 *
 */
function addRedirectAndBucketName(response) {

  const promises = response.Contents.map(function (object) {
    return S3.getObject({
      Key: object.Key,
      Bucket: BUCKET_NAME,
    })
      .promise()
      .then(function (result) {
        object.bucket_name = BUCKET_NAME;
        object.WebsiteRedirectLocation = result.WebsiteRedirectLocation;
        return object;
      });
  });

  return Promise.all(promises)
    .then(function (values) {
      return Promise.resolve(values);
    });
}

module.exports = (req) => {

  const { query } = req;
  const { marker } = query;

  return S3.listObjects({
    Bucket: BUCKET_NAME,
    MaxKeys,
    Delimiter: '_admin',
    Marker: marker || null,
  })
    .promise()
    .then(addRedirectAndBucketName)
    .then(returnResults)
    .catch(returnError);
}