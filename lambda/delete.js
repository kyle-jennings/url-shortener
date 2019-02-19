'use strict'

const url                  = require('url')
const bucketName           = 'kjd-urls';
const AWS                  = require('aws-sdk')
AWS.config                 = new AWS.Config();
AWS.config.accessKeyId     = 'AKIAIXW6EXTYLOJLLGQQ';
AWS.config.secretAccessKey = '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';
AWS.config.region          = 'us-east-1';
const S3                   = new AWS.S3();

module.exports.handle = (event, context, callback) => {

}
