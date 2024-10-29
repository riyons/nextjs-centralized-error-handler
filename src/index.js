// src/index.js

const errorHandler = require('./errorHandler');
const customErrors = require('./customErrors');

module.exports = {
  errorHandler,
  ...customErrors,
};
