const serverless = require('serverless-http');
const server = require('./server');


const handler = serverless(server);
module.exports.handler = async (event, context) => {
    process.env.DB_NAME = event.stageVariables.DB_NAME || process.env.DB_NAME;
    process.env.DB_HOST = event.stageVariables.DB_HOST || process.env.DB_HOST;
    process.env.BUCKET_NAME = event.stageVariables.BUCKET_NAME || process.env.BUCKET_NAME;
    return await handler(event, context);
};