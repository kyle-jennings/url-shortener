const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const MaxKeys = 1000;

function getTotalCount(marker, totalCount) {

  return S3.listObjects({
    Bucket: BUCKET_NAME,
    MaxKeys,
    Marker: marker || null,
  })
    .promise()
    .then((response) => {
      const count = response.Contents.length;
      const results = response.Contents;
      const last = results[count - 1];
      totalCount += count;
      if (count === MaxKeys) return getTotalCount(last.Key, totalCount);
      else return Promise.resolve(totalCount);
    })
    .catch(err => Promise.reject(err));
}


module.exports = () => {
  return getTotalCount(null, 0);
};
