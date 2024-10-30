// src/errorHandler.js

const { CustomError } = require('./customErrors');

function errorHandler(handler, options = {}) {
  const {
    logger = console.error,
    defaultStatusCode = 500,
    defaultMessage = 'An internal server error occurred. Please try again later.',
    formatError = null,
  } = options;

  return async (req, res) => {
    try {
      // Determine if it's an API Route or App Router based on the presence of 'res'
      if (res && typeof res.status === 'function') {
        // This indicates it's an API Route
        await handler(req, res);
      } else {
        // This indicates it's the App Router
        const response = await handler(req);

        // Ensure the response is returned correctly for App Router
        return response || new Response(null, { status: 204 }); // Default to a 204 No Content if nothing is returned
      }
    } catch (error) {
      // Log the error for monitoring and debugging
      logger('Route Error:', error);

      let statusCode = defaultStatusCode;
      let message = defaultMessage;

      // Check if the error is an instance of CustomError to get the specific status code and message
      if (error instanceof CustomError) {
        statusCode = error.statusCode;
        message = error.message || defaultMessage;
      }

      // Prepare the error response structure
      let errorResponse = {
        error: {
          message,
          type: error.name || 'Error',
        },
      };

      // Format the error response if a formatError function is provided
      if (formatError && typeof formatError === 'function') {
        errorResponse = formatError(error, req);
      }

      // Send the error response based on the context (API Route or App Router)
      if (res && typeof res.status === 'function') {
        // For API Route, send JSON response
        res.status(statusCode).json(errorResponse);
      } else {
        // For App Router, return a Response object with JSON content
        return new Response(JSON.stringify(errorResponse), {
          status: statusCode,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  };
}

module.exports = errorHandler;
