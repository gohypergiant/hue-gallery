module.exports = process.env.NODE_ENV === 'production' ?
  require('./config/webpack/production') :
  require('./config/webpack/development');
