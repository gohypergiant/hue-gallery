const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config');

const compiler = webpack(config);

const devMiddlware = () => new WebpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  quiet: false,
  noInfo: true,
});

const hotMiddleware = () => new WebpackHotMiddleware(compiler);

module.exports = {
  compiler,
  devMiddlware,
  hotMiddleware,
};
