const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';

const nunjucksEnv = nunjucks.configure(
  path.resolve('src', 'views'), {
    noCache: env === 'production',
    watch: env === 'development',
    trimBlocks: true,
    lstripBlocks: true,
  }
);

function render(filePath, data = {}) {
  let content = false;

  try {
    content = nunjucks.compile(
      fs.readFileSync(filePath, 'utf8'),
      nunjucksEnv
    );
  } catch (err) {
    throw err;
  }

  return content.render(data);
}

module.exports = render;
