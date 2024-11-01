// src/errorHandler.js

const { CustomError } = require('./customErrors');

/**
 * A higher-order function that wraps Next.js API route handlers or App Router handlers
 * to provide centralized error handling. It catches all exceptions thrown within the
 * handler, logs them, and sends a standardized error response to the client.
 *
 * @param {Function} handler - The original route handler function to be wrapped.
 *                               For API Routes, it should accept (req, res).
 *                               For App Router, it should accept (req) and return a Response.
 * @param {Object} [options={}] - Optional configuration object to customize error handling.
 * @param {Function} [options.logger=console.error] - A logging function to log errors.
 *                                                     Defaults to console.error.
 * @param {number} [options.defaultStatusCode=500] - The default HTTP status code for unhandled errors.
 * @param {string} [options.defaultMessage='An internal server error occurred. Please try again later.']
 *                                                   - The default error message for unhandled errors.
 * @param {Function} [options.formatError=null] - A function to customize the error response structure.
 *                                                It receives (error, req) and should return an object.
 *
 * @returns {Function} A wrapped handler function compatible with Next.js API Routes or App Router.
 *
 * @example
 *
 * // For API Routes
 * const { errorHandler, BadRequestError } = require('nextjs-centralized-error-handler');
 *
 * const handler = async (req, res) => {
 *   if (!req.body.name) {
 *     throw new BadRequestError('Name is required.');
 *   }
 *   // Other logic
 *   res.status(200).json({ success: true });
 * };
 *
 * export default errorHandler(handler);
 *
 * @example
 *
 * // For App Router
 * const { errorHandler, InternalServerError } = require('nextjs-centralized-error-handler');
 *
 * const handler = async (req) => {
 *   const data = await fetchData(); // May throw an error
 *   return new Response(JSON.stringify(data), {
 *     status: 200,
 *     headers: { 'Content-Type': 'application/json' },
 *   });
 * };
 *
 * export default errorHandler(handler);
 */
function errorHandler(handler, options = {}) {
  const {
    logger = console.error, // Default logger
    defaultStatusCode = 500, // Default status code for unhandled errors
    defaultMessage = 'An internal server error occurred. Please try again later.', // Default message for unhandled errors
    formatError = null, // Function to customize error response
  } = options;

  /**
   * The wrapped handler function that includes error handling logic.
   *
   * @param {Object} req - The incoming request object.
   * @param {Object} [res] - The response object (present for API Routes).
   *
   * @returns {Promise<void|Response>} - For API Routes, it sends a JSON response.
   *                                     For App Router, it returns a Response object.
   */
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
      /**
       * Log the error with a context-specific message.
       * For API Routes, prepend 'API Route Error:'
       * For App Router, prepend 'Route Error:'
       */
      const logMessage =
        res && typeof res.status === 'function'
          ? 'API Route Error:'
          : 'Route Error:';

      // Safely invoke the logger
      if (typeof logger === 'function') {
        try {
          logger(logMessage, error);
        } catch (loggerError) {
          console.error('Logging failed:', loggerError);
        }
      }

      let statusCode = defaultStatusCode;
      let message = defaultMessage;

      /**
       * If the error is an instance of CustomError, use its statusCode and message.
       * This ensures that custom-defined errors have their specific responses.
       */
      if (error instanceof CustomError) {
        statusCode = error.statusCode;
        message = error.message || defaultMessage;
      }

      /**
       * Prepare the error response structure.
       * This can be customized further by the user through the formatError function.
       */
      let errorResponse = {
        error: {
          message,
          type: error.name || 'Error',
        },
      };

      /**
       * If a formatError function is provided, use it to customize the error response.
       * This allows users to add additional fields or modify the structure as needed.
       */
      if (formatError && typeof formatError === 'function') {
        try {
          errorResponse = formatError(error, req);
        } catch (formatErrorException) {
          console.error('formatError failed:', formatErrorException);
          errorResponse = {
            message,
            type: error.name || 'Error',
          };
        }
      }

      /**
       * Send the error response based on the context (API Route or App Router).
       * - For API Routes: Send a JSON response with the appropriate status code.
       * - For App Router: Return a Response object with JSON content.
       */
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
