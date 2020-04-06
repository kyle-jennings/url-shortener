const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS = require('aws-sdk');
const listAliases = require('./listAliases');

const S3 = new AWS.S3();
const MaxKeys = 1000;

function getTotalCount(obj, Marker) {
  console.log(obj.total);
  return S3.listObjects({
    Bucket: BUCKET_NAME,
    MaxKeys,
    Marker: Marker || null,
  })
    .promise()
    .then((response) => {
      const count = response.Contents.length;
      const results = response.Contents;
      const last = results[count - 1];
      obj.total += count;
      obj.batches.push(Marker);

      if (count === MaxKeys) return getTotalCount(obj, last.Key);
      else return Promise.resolve(obj);
    })
    .catch(err => Promise.reject(err));
}


module.exports = () => {
  const tracking = {
    batches: [],
    firstBatch: [],
    total: 0,
  };
  return getTotalCount(tracking)
    .then((results) => {
      const args = {
        query: {
          MaxKeys: 100,
        }
      }
     return listAliases(args)
      .then((res) => {
        results.firstBatch = res.results;
        return Promise.resolve(results);
      })
      .catch((err) => {
        return Promise.reject(results);
      });
    })
    .catch(err => Promise.reject(err));
};
