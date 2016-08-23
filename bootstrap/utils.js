const fs = require('fs');

exports.isDir = function isDir(dir) {
  try {
    fs.statSync(dir);
  } catch (err) {
    return false;
  }

  if (fs.statSync(dir).isDirectory()) {
    return true;
  }

  return false;
};

exports.exists = function exists(file) {
  try {
    fs.statSync(file);
  } catch (err) {
    return false;
  }

  return true;
};

exports.startsWithUnderscore = function startsWithUnderscore(str) {
  return str.charAt(0) === '_';
};
