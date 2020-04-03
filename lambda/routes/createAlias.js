const AWS = require('aws-sdk');
const validUrl = require('../modules/_validateURL');
const buildURL = require('../modules/_buildURL');

const { BUCKET_NAME } = process.env;
const S3 = new AWS.S3();

/**
 * Checks to see if a key exists by looking to grab object meta.
 * 
 * if it DOES exist - we send back a promise resolve
 * if it does NOT exist, and the err code is "NotFound", we also send back a promise. which is off.
 * if it does NOT exist and we dont get that err code, we reject with the err
 *
 */
function doesKeyExist(path) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: path,
  };
  return S3.headObject(params)
    .promise()
    .then(() => Promise.resolve()) // Promise.reject()
    .catch(err => Promise.reject(err));
}

/**
 * Checks to see if a key exists by looking to grab object meta.
 * 
 * if it DOES exist - we send back a promise resolve
 * if it does NOT exist, and the err code is "NotFound", we also send back a promise. which is off.
 * if it does NOT exist and we dont get that err code, we reject with the err
 *
 */
function isPathFree(path) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: path,
  };
  return S3.headObject(params)
    .promise()
    .then(() => Promise.resolve(false)) // Promise.reject()
    .catch((err) => {
      return err.code === 'NotFound' ? Promise.resolve(true) : Promise.reject(err);
    });
}

function buildResponse(statusCode, message, path = false ) {
  const body = { message, statusCode, path };
  body.status = statusCode === 200 ? 'success' : 'fail';

  if (statusCode !== 200) {
    body.url = null;
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(body);
  }

  return buildURL()
    .then((url) => {
      body.url = url;
      return Promise.resolve(body);
    })
    .catch((err) => {
      body.url = null;
      return Promise.resolve(body);
    });

}


function generatePath(path = '') {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const position = Math.floor(Math.random() * characters.length);
  const character = characters.charAt(position);

  if (path.length === 7) {
    return path;
  }

  return generatePath(path + character);
}

/**
 * if a custom past was passed in, we check to see if it's already in use
 */
function getCustomPath(path) {
  return new Promise(function (resolve, reject) {
    const err = { statusCode: 403, message: path + ' is currently in use.  Please try something else.' }
    doesKeyExist(path)
      .then(() => reject(err))
      .catch(() => resolve(path));
  });
}

/**
 * try to generate a random path, and then recursively try again if it already exists
 */
function getPath() {
  return new Promise(function (resolve, reject) {
    // otherwise generate a random alias
    const path = generatePath();
    doesKeyExist(path)
      .then(() => resolve(getPath()))
      .catch(() => resolve(path));
  });
}

function saveRedirect(redirect) {
  return S3.putObject(redirect).promise()
    .then(() => Promise.resolve(redirect['Key']));
}

function buildRedirect(path, longUrl = false) {
  const redirect = {
    Bucket: BUCKET_NAME,
    Key: path,
  };

  if (longUrl) {
    redirect['WebsiteRedirectLocation'] = longUrl;
  }

  return redirect;
}

module.exports = (req) => {

  const { body } = req;
  const longUrl = body.url || '';
  const customAlias = body.customAlias || null;

  return validUrl(longUrl)
    .then(() => (customAlias ? getCustomPath(customAlias) : getPath()))
    .catch(err => Promise.reject(err))
    .then((path) => {
      const redirect = buildRedirect(path, longUrl);
      return saveRedirect(redirect);
    })
    .catch(err => Promise.reject(err))
    .then((path) => {
      const response = buildResponse(200, 'URL successfully shortened', path);
      return Promise.resolve(response);
    })
    .catch((err) => {
      const response = buildResponse(err.statusCode, err.message);
      return Promise.resolve(response);
    });
}
