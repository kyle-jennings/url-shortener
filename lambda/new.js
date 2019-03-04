'use strict'

const url        = require('url');
const bucketName = 'kjd-urls';
const AWS        = require('aws-sdk');
const S3         = new AWS.S3();
const baseURL    = null;

exports.handler = (event, context, callback) => {

  let body        = JSON.parse(event.body);
  let longUrl     = body.url || '';
  let customAlias = body.customAlias || null;

  validate(longUrl)
    .then(function () {
      if(customAlias) {
        console.log('building customAlias');
        return getCustomPath(customAlias);
      } else {
        console.log('building random path');
        return getPath();
      }
    })
    .catch(function (err) {
      callback(null, err);
    })
    .then(function (path) {
      let redirect = buildRedirect(path, longUrl);
      return saveRedirect(redirect);
    })
    .then(function (path) {
      let response = buildResponse(200, 'URL successfully shortened', path);
      return Promise.resolve(response);
    })
    .catch(function (err) {
      let response = buildResponse(err.statusCode, err.message);
      return Promise.resolve(response);
    })
    .then(function (response) {
      callback(null, response);
    });
}

function validate (longUrl) {
  if (!longUrl || longUrl === '') {
    return Promise.reject({
      statusCode: 400,
      message: 'URL is required'
    });
  }

  let parsedUrl = url.parse(longUrl)
  if (parsedUrl.protocol === null || parsedUrl.host === null) {
    return Promise.reject({
      statusCode: 400,
      message: 'URL is invalid'
    });
  }

  return Promise.resolve(longUrl);
}


function getCustomPath(path) {
  return new Promise(function (resolve, reject) {
    let errMsg = path + ' is currently in use.  Please try something else.';
    isPathFree(path)
    .then(function (isFree) {
      return isFree ? resolve(path) : reject(buildResponse(403, errMsg));
    });
  });
}

function getPath() {
  return new Promise(function (resolve, reject) {
    // otherwise generate a random alias
    let path = generatePath();
    isPathFree(path)
      .then(function (isFree) {
        return isFree ? resolve(path) : resolve(getPath());
      });
  });
}

function isPathFree (path) {
  return S3.headObject(buildRedirect(path))
    .promise()
    .then(() => Promise.resolve(false))
    .catch((err) => err.code == 'NotFound' ? Promise.resolve(true) : Promise.reject(err));
}

function generatePath (path = '') {
  let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let position = Math.floor(Math.random() * characters.length);
  let character = characters.charAt(position);

  if (path.length === 7) {
    return path;
  }

  return generatePath(path + character);
}

function saveRedirect (redirect) {
  return S3.putObject(redirect).promise()
    .then(() => Promise.resolve(redirect['Key']));
}

function buildRedirect(path, longUrl = false) {
  let redirect = {
    'Bucket': bucketName,
    'Key': path,
  };

  if (longUrl) {
    redirect['WebsiteRedirectLocation'] = longUrl;
  }

  return redirect;
}

function buildRedirectUrl (path) {
  let url = `https://${bucketName}.s3.us-east-1.amazonaws.com/`;
  
  if (baseURL && baseURL !== '') {
    url = baseURL;
  }

  return url + path;
}

function buildResponse (statusCode, message, path = false ) {
  let body = { message };

  if (path) {
    body['path'] = path
    body['url'] = buildRedirectUrl(path)
  };

  return {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: statusCode,
    body: JSON.stringify(body)
  }
}
