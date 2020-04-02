const fs = require('fs');
const path = require('path');

const fileName = 'config.json';
let config;
function getParentDir(dir) {
  return path.dirname(dir);
}
function getRootdir(file) {
  let dir = file;
  for (let i = 0; i < 4; i++) {
    dir = getParentDir(dir);
  }

  return dir + '/' + fileName;
}

const filePath = getRootdir(fs.realpathSync(__filename));
if (fs.existsSync(filePath)) {
  config = require(filePath);
}

process.env.BUCKET_NAME = config.BUCKET_NAME || process.env.BUCKET_NAME;
