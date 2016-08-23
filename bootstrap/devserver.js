const http = require('http');
const mw = require('http-middleware');
const path = require('path');
const opn = require('opn');
const { green } = require('chalk');
const render = require('./nunjucks');
const { port } = require('../config');
const { exists, isDir, startsWithUnderscore } = require('./utils');
const { devMiddlware, hotMiddleware } = require('./webpack');

const viewPath = path.resolve('src', 'views');
const notFoundFile = path.join(viewPath, '404.html');

// We cannot get the asset URLs from webpack stats when using middleware
const assetTags = {
  cssTags: ['<script src="/assets/styles.js"></script>'],
  jsTags: ['<script src="/assets/bundle.js"></script>'],
};

function onListen() {
  process.on('SIGINT', () => {
    this.close();
    process.exit(0);
  });

  console.log(green(
    'Local server running on http://localhost:%s'
  ), port);

  opn(`http://localhost:${port}`);
}

function fileHandler(req, res) {
  res.setHeader('Content-Type', 'text/html');

  let filePath = path.join(
    viewPath,
    decodeURIComponent(path.format(path.parse(req.url)))
  );

  const lastPath = filePath.split('/').pop();

  // If directory, default to an index.html file
  if (isDir(filePath)) {
    filePath = path.join(filePath, 'index');
  }

  // Ignore underscore prefixed template files
  if (startsWithUnderscore(lastPath)) {
    res.write(render(notFoundFile, assetTags));
    return res.end();
  }

  // Append .html to file path
  filePath = `${filePath}.html`;

  // Looks for <file>.html in our file system
  if (!exists(filePath)) {
    res.write(render(notFoundFile, assetTags));
    return res.end();
  }

  res.write(render(filePath, assetTags));
  return res.end();
}

const middleware = [
  devMiddlware(),
  hotMiddleware(),
];

const server = http.createServer((req, res) =>
  mw(req, res, middleware, () => fileHandler(req, res))
);

server.listen(port, onListen);
