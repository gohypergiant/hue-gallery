const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import');
const customProperties = require('postcss-custom-properties');
const customMedia = require('postcss-custom-media');
const cssnano = require('cssnano');
const config = require('../index');

const assetsMnifest = new AssetsPlugin();
const hash = '[chunkhash]';

const babelPresets = ['es2015'];
const babelPlugins = ['transform-runtime'];

if (config.react) {
  babelPresets.push('react');
  babelPlugins.push('transform-react-constant-elements');
  babelPlugins.push('transform-react-inline-elements');
}

module.exports = [{
  name: 'js',
  cache: false,
  bail: true,
  debug: false,
  profile: false,
  devtool: false,
  entry: {
    js: path.resolve('src', 'js', 'index.js'),
  },
  output: {
    path: path.resolve('public', 'assets'),
    publicPath: '/assets/',
    filename: `bundle__${hash}.js`,
    pathinfo: false,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: false,
          presets: babelPresets,
          plugins: babelPlugins,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('"production"'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin('common', `common__${hash}.js`),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    assetsMnifest,
  ],
}, {
  name: 'css',
  cache: false,
  bail: true,
  debug: false,
  profile: false,
  devtool: false,
  entry: {
    css: path.resolve('src', 'css', 'index.css'),
  },
  output: {
    path: path.resolve('public', 'assets'),
    publicPath: '/assets/',
    filename: `styles__${hash}.js`,
    pathinfo: false,
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('raw!postcss'),
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin(`styles__${hash}.css`),
    assetsMnifest,
  ],
  postcss: webpackInstance => [
    atImport({ addDependencyTo: webpackInstance }),
    customProperties,
    customMedia,
    autoprefixer,
    cssnano,
  ],
}];
