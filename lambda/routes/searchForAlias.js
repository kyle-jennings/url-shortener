const url        = require('url');
const AWS        = require('aws-sdk');

const { BUCKET_NAME } = process.env;
const S3         = new AWS.S3();


function checkForURLMatch(results) {
  return new Promise(function (resolve, reject) {
    results.forEach(function (e, i) {
      if (url === e.WebsiteRedirectLocation) {

        return resolve(e);
      }
    });

    const marker = results[results.length - 1];
    return reject(marker);
  });
}


function collectRedirects(response) {

  const promises = response.Contents.map(function (object) {
    return S3.getObject({
      Key: object.Key,
      Bucket: BUCKET_NAME
    })
      .promise()
      .then(function (result) {
        object.WebsiteRedirectLocation = result.WebsiteRedirectLocation;
        return object;
      });
  });

  return Promise.all(promises)
    .then(function (values) {
      return Promise.resolve(values);
    });
}


/**
 * [searchForURL description]
 * @param  {[type]} url    [description]
 * @param  {[type]} marker [description]
 * @return {[type]}        [description]
 */
function searchForURL(url, marker = null) {
  return S3.listObjects({
    Bucket: BUCKET_NAME,
    MaxKeys: 10,
    Marker: marker,
  })
    .promise()
    .then(collectRedirects)
    .then(checkForURLMatch)
    .then(function (results) {
      return Promise.resolve(result);
    })
    .catch(function (marker) {
      return searchForURL(url, marker.Key)
    });
}

function searchForKey(key) {

  return S3.getObject({
    Bucket: BUCKET_NAME,
    Key: key,
  })
    .promise()
    .then(function (data) {
      return Promise.resolve(data);
    })
    .catch(function (err) {
      return Promise.reject(err);
    });

}

function returnErrorResp(err) {
  return {
    statusCode: 404,
    headers: { 
      'Access-Control-Allow-Origin': '*' 
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
      'Access-Control-Allow-Origin': '*',
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

module.exports.searchForAlias = (body, callback) => {
  const url = body.url || null;
  const key = body.key || null;

  if (key) {
    searchForKey(key)
      .then(function (data) {
        callback(null, returnResults(data))
      })
      .catch(function (err) {
        callback(null, returnErrorResp(err))
      });
  }

  if (url) {
    searchForURL(url)
      .then(function (data) {
        callback(null, returnResults(data))
      })
      .catch(function (err) {
        callback(null, returnErrorResp(err))
      });
  }

  callback(null, {
    statusCode: 500,
    headers: { 
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'fail',
      results: 'URL or Key not passed in',
    }),
  });
}
