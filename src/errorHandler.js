// src/errorHandler.js

const { CustomError } = require('./customErrors'); // Ensure you import CustomError

function errorHandler(handler, options = {}) {
  const {
    logger = console.error,
    defaultStatusCode = 500,
    defaultMessage = 'An internal server error occurred. Please try again later.',
    formatError = null,
  } = options;

  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      logger('API Route Error:', error);

      let statusCode = defaultStatusCode;
      let message = defaultMessage;

      if (error instanceof CustomError) {
        statusCode = error.statusCode;
        message = error.message || defaultMessage;
      }

      let errorResponse = {
        error: {
          message,
          type: error.name || 'Error',
        },
      };

      if (formatError && typeof formatError === 'function') {
        errorResponse = formatError(error, req);
      }

      res.status(statusCode).json(errorResponse);
    }
  };
}

module.exports = errorHandler;
