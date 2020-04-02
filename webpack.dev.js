const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config');

config.devServer = {
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  index: '_admin.html',
  historyApiFallback: {
    index: '/_admin.html',
  },
  port: 7000,
  serveIndex: false,
  
};

module.exports = config;
