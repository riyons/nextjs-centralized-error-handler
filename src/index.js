// src/index.js

/**
 * # Next.js Centralized Error Handler
 *
 * Centralized error handling for Next.js applications, compatible with both API Routes and the App Router.
 *
 * ## Features
 * - Dual compatibility with API Routes and App Router
 * - Comprehensive error handling to prevent information leakage
 * - Customizable logging and error response formatting
 *
 * ## Quick Start
 *
 * See the [README](./README.md) for detailed usage examples.
 */

const errorHandler = require('./errorHandler');
const customErrors = require('./customErrors');

/**
 * Exported functions and classes.
 */
module.exports = {
  errorHandler,
  ...customErrors,
};
