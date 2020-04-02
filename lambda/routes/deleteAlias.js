const AWS = require('aws-sdk')
const buildResponse = require('../modules/_buildResponse');

const { BUCKET_NAME } = process.env;
const S3 = new AWS.S3();

function isPathFree(BUCKET_NAME, key) {

  return S3.headObject({
    Bucket: BUCKET_NAME,
    Key: key,
  })
    .promise()
    .then(function (data) {
      return Promise.reject(false);
    })
    .catch(function (err) {
      return err.code === 'NotFound' ? Promise.resolve(true) : Promise.reject(false);
    });
}

module.exports = (req) => {
  const { body } = req;
  const key = body.key || null;
  if (!key) {
    return (buildResponse(403, 'No key provided, can you try that again?'));
  }

  return S3.deleteObject({
    Bucket: BUCKET_NAME,
    Key: key,
  })
    .promise()
    .then(function (response) {
      return new Promise(function (resolve, reject) {
        isPathFree(BUCKET_NAME, key)
          .then(function (isFree) {
            return isFree 
              ? resolve(buildResponse(200, 'object was found. deleted: ' + key ))
              : reject(buildResponse(404, key + ' object was found, but deletion failed!'));
          });
      });
    });
};
