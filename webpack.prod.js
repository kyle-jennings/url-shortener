const config = require('./webpack.config');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

config.mode = 'production';

config.optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      include: /\.min\.js$/,
    }),
    new OptimizeCSSAssetsPlugin({}),
  ],
};

module.exports = config;
