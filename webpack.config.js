const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const WebpackNotifierPlugin = require('webpack-notifier');
const autoprefixer = require('autoprefixer');
const distName = require('./package.json').name;
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // installed via npm

let config = {
  BUCKET: process.env.BUCKET,
  REGION: process.env.REGION,
  API_STAGE: process.env.API_STAGE,
  API_URL: process.env.API_URL,
  DOMAIN: process.env.DOMAIN,
};

if (fs.existsSync('./config.json')) {
  config = require('./config.json');
}


const ASSET_PATH = process.env.ASSET_PATH || '/';

const paths = {
  root: './',
  srcRoot: './_src',
  distRoot: './dist',
  npmRoot: './node_modules',
  scssPath: './_src/scss',
  scssGlob: './_src/scss/**/*.scss',
};
paths.assetsRoot = '_admin/';

module.exports = {
  entry: {
    [distName]: './_src/entry.js',
  },
  output: {
    filename: '' + paths.assetsRoot + 'js/[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // css
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
        ],
      },
      // scss
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [
                autoprefixer({ browsers: ['last 2 version'] }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                paths.npmRoot,
                // paths.npmRoot + '/hamburgers/_sass',
                // paths.npmRoot + '/@fortawesome/fontawesome-free',
                // paths.npmRoot + '/normalize.css',
                // paths.npmRoot + '/bulma-scss',
                // paths.npmRoot + '/bootstrap',
                paths.srcRoot + '/scss',
              ],
            },
          },
        ],
      },
      // fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'fonts',
          publicPath: ASSET_PATH + '/fonts',
        },
      },
      // images
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: 'file-loader',
        options: {
          limit: 1,
          name: '[name].[ext]',
          outputPath: 'img',
          publicPath: ASSET_PATH + '/img',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Foo',
      filename: '_admin.html',
      template: '_src/html/admin.html',
      // inject: true,
      minify: false,
      chunks: 'all',
      chunksSortMode: 'auto',
    }),
    new HtmlReplaceWebpackPlugin([
      {
        pattern: '{{project-name}}',
        replacement: distName,
      },
    ]),
    new webpack.DefinePlugin({
      FOO: 'BAR',
      __BUCKET_NAME__: JSON.stringify(config.BUCKET_NAME),
      __DOMAIN__: JSON.stringify(config.DOMAIN),
      __API__: JSON.stringify(config.API),
      __API_STAGE__: JSON.stringify(config.API_STAGE),
      __REGION__: JSON.stringify(config.REGION),
    }),
    new MiniCssExtractPlugin({
      filename: '' + paths.assetsRoot + 'css/[name].[hash].css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'),
        to: path.resolve(__dirname, 'dist/' + paths.assetsRoot + 'fonts'),
      },
      {
        from: path.resolve(__dirname, '_src/img'),
        to: path.resolve(__dirname, 'dist/' + paths.assetsRoot + 'static/img'),
      }
    ]),
    new (
      webpack.optimize.OccurenceOrderPlugin
      || webpack.optimize.OccurrenceOrderPlugin
    )(),
    new WebpackNotifierPlugin(),
  ],
};
