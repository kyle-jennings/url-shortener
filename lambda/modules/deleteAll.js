const { BUCKET_NAME } = process.env;
const AWS = require('aws-sdk');
const allowKey = require('./_allowKey.js');

const S3 = new AWS.S3();
const batchSize = 1000;
let total = [];

function listObjects(Marker) {
  return S3.listObjects({
    Bucket: BUCKET_NAME,
    MaxKeys: batchSize,
    Marker: Marker || null,
  })
    .promise()
    .then((response) => {
      const results = response.Contents;
      const filtered = results.filter(e => allowKey(e.Key));
      total = total.concat(filtered);

      if (results.length < batchSize || results.length === 0) return Promise.resolve(total);
      const marker = results[results.length - 1].Key;
      return listObjects(marker);
    })
    .catch(err => Promise.reject(err));
}


listObjects()
  .then((total) => {
    const promises = [];
    for (let i = 0, j = total.length, chunk = 10; i < j; i += chunk) {
      const batch = total.slice(i, i + chunk);
      const params = {
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: batch.map(e => ({ Key: e.Key })),
          Quiet: true,
        },
      };
      promises.push(
        S3.deleteObjects(params)
          .promise()
          .then(response => Promise.resolve(response))
          .catch(err => Promise.resject(err))
      );
    }
    return Promise.all(promises)
      .then((response) =>  {
        console.log(response);
      });
  })
  .catch((err) => {
    console.log(err);
  });