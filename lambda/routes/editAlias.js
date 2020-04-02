const AWS = require('aws-sdk');

const buildResponse = require('../modules/_buildResponse');
const validUrl = require('../modules/_validateURL');

const { BUCKET_NAME } = process.env;
const S3 = new AWS.S3()


function updateMeta(key, longUrl) {
  return S3.putObject({
    Bucket: BUCKET_NAME,
    Key: key,
    WebsiteRedirectLocation: longUrl,
  })
    .promise()
    .then(data => Promise.resolve(data))
    .catch(err => Promise.reject(err));
}


function keyExists(key) {
  return S3.headObject({
    Bucket: BUCKET_NAME,
    Key: key,
  })
    .promise()
    .then(() => Promise.resolve(true))
    .catch(err => Promise.reject(err));
}


module.exports = (body, callback) => {
  const longUrl = body.url || null;
  const key = body.key || null;


  validUrl(longUrl)
    .then(function () {
      return keyExists(key)
        .then(() => Promise.resolve(true))
        .catch(err => Promise.reject(err));
    })
    .catch(function (err) {
      console.log('key was not found - abort!');
      callback(null, buildResponse(err.statusCode, err.message));
    })
    .then(function () {
      console.log('updating object!', key, longUrl);
      return updateMeta(key, longUrl);
    })
    .then(function () {
      console.log('update successfull!');
      callback(null, buildResponse(200, key + ' updated.', longUrl));
    })
    .catch(function (err) {
      console.log('update failed!');
      callback(null, buildResponse(err.statusCode, err.message));
    });
};
