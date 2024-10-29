// src/errorHandler.js

function errorHandler(handler, options = {}) {
  const {
    logger = console.error, // Default to console.error
    defaultStatusCode = 500,
    defaultMessage = 'An internal server error occurred. Please try again later.',
    formatError = null,
  } = options;

  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      // Log the error
      logger('API Route Error:', error);

      // Determine status code and message
      const statusCode = error.statusCode || defaultStatusCode;
      const message =
        statusCode === 500 ? defaultMessage : error.message || defaultMessage;

      // Build error response
      let errorResponse = {
        error: {
          message,
          type: error.name || 'Error',
        },
      };

      // Allow custom error formatting
      if (formatError && typeof formatError === 'function') {
        errorResponse = formatError(error, req);
      }

      // Send response
      res.status(statusCode).json(errorResponse);
    }
  };
}

module.exports = errorHandler;
