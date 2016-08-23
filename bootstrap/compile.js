const fs = require('fs');
const path = require('path');
const walk = require('walk');
const mkdirp = require('mkdirp');
const { green, yellow, blue } = require('chalk');
const rmdir = require('rmdir');
const render = require('./nunjucks');
const { startsWithUnderscore } = require('./utils');
const { compiler } = require('./webpack');

const viewsPath = path.resolve('src', 'views');

rmdir(path.resolve('public'));

console.log(blue('Compiling templates and assets...'));

compiler.run(() => {
  const walker = walk.walk(viewsPath);

  const manifest = JSON.parse(
    fs.readFileSync(path.resolve('webpack-assets.json'), 'utf8')
  );

  const cssTags = [
    `<link href="${manifest.css.css}" rel="stylesheet" />`,
  ];

  const jsTags = [
    `<script src="${manifest.common.js}"></script>`,
    `<script src="${manifest.js.js}"></script>`,
  ];

  walker.on('file', (root, fileStat, next) => {
    const filePath = path.resolve(root, fileStat.name);
    const lastPath = filePath.split('/').pop();
    const content = render(filePath, { cssTags, jsTags });

    if (filePath.includes('assets')) {
      console.warn(yellow(
        '\nHeads up! You have a view folder with the name of "assets".' +
        '\nThis is also the folder name we use for your compiled Webpack assets.\n'
      ));
    }

    const dest = filePath
      .replace('src', 'public')
      .replace('views/', '');

    // Skip files beginning with underscore
    if (!startsWithUnderscore(lastPath)) {
      mkdirp.sync(path.dirname(dest));
      fs.writeFileSync(dest, content, 'utf8');
    }

    next();
  });

  walker.on('end', () => {
    console.log(green('Application successfully compiled to "/public" folder.'));
  });
});
