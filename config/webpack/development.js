const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import');
const customProperties = require('postcss-custom-properties');
const customMedia = require('postcss-custom-media');
const config = require('../index');

const babelPresets = ['es2015'];

if (config.react) {
  babelPresets.push('react');
}

const middlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000';

module.exports = {
  cache: true,
  devtool: '#eval',
  entry: {
    bundle: [path.resolve('src', 'js', 'index.js'), middlewareScript],
    styles: [path.resolve('src', 'css', 'index.css'), middlewareScript],
  },
  output: {
    path: path.resolve('public', 'assets'),
    publicPath: '/assets/',
    filename: '[name].js',
    pathinfo: false,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: babelPresets,
          plugins: ['transform-runtime'],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ['style', 'raw', 'postcss'],
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  postcss: webpackInstance => [
    atImport({ addDependencyTo: webpackInstance }),
    customProperties,
    customMedia,
    autoprefixer,
  ],
};
