const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const params = {
  Bucket: BUCKET_NAME,
};

module.exports = () => {
  return S3.getBucketLocation(params)
    .promise()
    .then(
      (data) => {
        if (data.LocationConstraint === null) return Promise.reject(new Error('no bucket region!'));
        const region = data.LocationConstraint === '' ? 'us-east-1' : data.LocationConstraint;

        return Promise.resolve(`${BUCKET_NAME}.s3-website.${region}.amazonaws.com/`);
      },
      err => Promise.reject(err)
    );
};
