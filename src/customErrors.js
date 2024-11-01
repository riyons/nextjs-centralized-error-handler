// src/customErrors.js

/**
 * Base class for all custom errors.
 * Extends the built-in Error class to include additional properties such as statusCode.
 *
 * @extends Error
 */
class CustomError extends Error {
  /**
   * Creates an instance of CustomError.
   *
   * @param {string} [message='An error occurred.'] - The error message.
   * @param {number} [statusCode=500] - The HTTP status code associated with the error.
   * @param {string} [name='CustomError'] - The name of the error.
   */
  constructor(
    message = 'An error occurred.',
    statusCode = 500,
    name = 'CustomError',
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Represents a Bad Request error (HTTP 400).
 * Indicates that the server cannot or will not process the request due to a client error.
 *
 * @extends CustomError
 */
class BadRequestError extends CustomError {
  /**
   * Creates an instance of BadRequestError.
   *
   * @param {string} [message='It seems there was an error with your request. Please check the data you entered and try again.']
   *        - The error message.
   */
  constructor(
    message = 'It seems there was an error with your request. Please check the data you entered and try again.',
  ) {
    super(message, 400, 'BadRequestError');
  }
}

/**
 * Represents an Unauthorized error (HTTP 401).
 * Indicates that the request requires user authentication.
 *
 * @extends CustomError
 */
class UnauthorizedError extends CustomError {
  /**
   * Creates an instance of UnauthorizedError.
   *
   * @param {string} [message='Unauthorized access. Please log in again.'] - The error message.
   */
  constructor(message = 'Unauthorized access. Please log in again.') {
    super(message, 401, 'UnauthorizedError');
  }
}

/**
 * Represents a Payment Required error (HTTP 402).
 * Reserved for future use. Currently indicates that payment is required to access the resource.
 *
 * @extends CustomError
 */
class PaymentRequiredError extends CustomError {
  /**
   * Creates an instance of PaymentRequiredError.
   *
   * @param {string} [message='Payment is required to access this resource.'] - The error message.
   */
  constructor(message = 'Payment is required to access this resource.') {
    super(message, 402, 'PaymentRequiredError');
  }
}

/**
 * Represents a Forbidden error (HTTP 403).
 * Indicates that the server understood the request but refuses to authorize it.
 *
 * @extends CustomError
 */
class ForbiddenError extends CustomError {
  /**
   * Creates an instance of ForbiddenError.
   *
   * @param {string} [message='Access denied.'] - The error message.
   */
  constructor(message = 'Access denied.') {
    super(message, 403, 'ForbiddenError');
  }
}

/**
 * Represents a Not Found error (HTTP 404).
 * Indicates that the server can't find the requested resource.
 *
 * @extends CustomError
 */
class NotFoundError extends CustomError {
  /**
   * Creates an instance of NotFoundError.
   *
   * @param {string} [message='The requested resource was not found.'] - The error message.
   */
  constructor(message = 'The requested resource was not found.') {
    super(message, 404, 'NotFoundError');
  }
}

/**
 * Represents a Method Not Allowed error (HTTP 405).
 * Indicates that the HTTP method used is not allowed for the requested resource.
 *
 * @extends CustomError
 */
class MethodNotAllowedError extends CustomError {
  /**
   * Creates an instance of MethodNotAllowedError.
   *
   * @param {string} [message='The HTTP method used is not allowed for this resource.'] - The error message.
   */
  constructor(
    message = 'The HTTP method used is not allowed for this resource.',
  ) {
    super(message, 405, 'MethodNotAllowedError');
  }
}

/**
 * Represents a Not Acceptable error (HTTP 406).
 * Indicates that the requested resource is not available in a format acceptable to the client.
 *
 * @extends CustomError
 */
class NotAcceptableError extends CustomError {
  /**
   * Creates an instance of NotAcceptableError.
   *
   * @param {string} [
   *   message='The requested resource is not available in a format acceptable to your browser.'
   * ] - The error message.
   */
  constructor(
    message = 'The requested resource is not available in a format acceptable to your browser.',
  ) {
    super(message, 406, 'NotAcceptableError');
  }
}

/**
 * Represents a Request Timeout error (HTTP 408).
 * Indicates that the server timed out waiting for the request.
 *
 * @extends CustomError
 */
class RequestTimeoutError extends CustomError {
  /**
   * Creates an instance of RequestTimeoutError.
   *
   * @param {string} [message='The server timed out waiting for your request.'] - The error message.
   */
  constructor(message = 'The server timed out waiting for your request.') {
    super(message, 408, 'RequestTimeoutError');
  }
}

/**
 * Represents a Conflict error (HTTP 409).
 * Indicates that a conflict occurred with the current state of the target resource.
 *
 * @extends CustomError
 */
class ConflictError extends CustomError {
  /**
   * Creates an instance of ConflictError.
   *
   * @param {string} [message='A conflict occurred with the current state of the resource.'] - The error message.
   */
  constructor(
    message = 'A conflict occurred with the current state of the resource.',
  ) {
    super(message, 409, 'ConflictError');
  }
}

/**
 * Represents a Payload Too Large error (HTTP 413).
 * Indicates that the request entity is larger than limits defined by server.
 *
 * @extends CustomError
 */
class PayloadTooLargeError extends CustomError {
  /**
   * Creates an instance of PayloadTooLargeError.
   *
   * @param {string} [message='The request payload is too large.'] - The error message.
   */
  constructor(message = 'The request payload is too large.') {
    super(message, 413, 'PayloadTooLargeError');
  }
}

/**
 * Represents a Too Many Requests error (HTTP 429).
 * Indicates that the user has sent too many requests in a given amount of time.
 *
 * @extends CustomError
 */
class TooManyRequestsError extends CustomError {
  /**
   * Creates an instance of TooManyRequestsError.
   *
   * @param {string} [
   *   message='You have made too many requests in a short period of time.'
   * ] - The error message.
   */
  constructor(
    message = 'You have made too many requests in a short period of time.',
  ) {
    super(message, 429, 'TooManyRequestsError');
  }
}

/**
 * Represents an Internal Server Error (HTTP 500).
 * Indicates that the server encountered an unexpected condition.
 *
 * @extends CustomError
 */
class InternalServerError extends CustomError {
  /**
   * Creates an instance of InternalServerError.
   *
   * @param {string} [
   *   message='An internal server error occurred. Please try again later.'
   * ] - The error message.
   */
  constructor(
    message = 'An internal server error occurred. Please try again later.',
  ) {
    super(message, 500, 'InternalServerError');
  }
}

/**
 * Represents a Not Implemented error (HTTP 501).
 * Indicates that the server does not support the functionality required to fulfill the request.
 *
 * @extends CustomError
 */
class NotImplementedError extends CustomError {
  /**
   * Creates an instance of NotImplementedError.
   *
   * @param {string} [message='This functionality has not been implemented.'] - The error message.
   */
  constructor(message = 'This functionality has not been implemented.') {
    super(message, 501, 'NotImplementedError');
  }
}

/**
 * Represents a Bad Gateway error (HTTP 502).
 * Indicates that the server received an invalid response from the upstream server.
 *
 * @extends CustomError
 */
class BadGatewayError extends CustomError {
  /**
   * Creates an instance of BadGatewayError.
   *
   * @param {string} [
   *   message='Received an invalid response from the upstream server.'
   * ] - The error message.
   */
  constructor(
    message = 'Received an invalid response from the upstream server.',
  ) {
    super(message, 502, 'BadGatewayError');
  }
}

/**
 * Represents a Service Unavailable error (HTTP 503).
 * Indicates that the server is currently unable to handle the request due to temporary overloading or maintenance.
 *
 * @extends CustomError
 */
class ServiceUnavailableError extends CustomError {
  /**
   * Creates an instance of ServiceUnavailableError.
   *
   * @param {string} [message='The service is currently unavailable.'] - The error message.
   */
  constructor(message = 'The service is currently unavailable.') {
    super(message, 503, 'ServiceUnavailableError');
  }
}

/**
 * Represents a Gateway Timeout error (HTTP 504).
 * Indicates that the server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.
 *
 * @extends CustomError
 */
class GatewayTimeoutError extends CustomError {
  /**
   * Creates an instance of GatewayTimeoutError.
   *
   * @param {string} [
   *   message='The upstream server failed to send a request in time.'
   * ] - The error message.
   */
  constructor(
    message = 'The upstream server failed to send a request in time.',
  ) {
    super(message, 504, 'GatewayTimeoutError');
  }
}

/**
 * Represents an HTTP Version Not Supported error (HTTP 505).
 * Indicates that the server does not support the HTTP protocol version used in the request.
 *
 * @extends CustomError
 */
class HTTPVersionNotSupportedError extends CustomError {
  /**
   * Creates an instance of HTTPVersionNotSupportedError.
   *
   * @param {string} [
   *   message='The server does not support the HTTP protocol version used in the request.'
   * ] - The error message.
   */
  constructor(
    message = 'The server does not support the HTTP protocol version used in the request.',
  ) {
    super(message, 505, 'HTTPVersionNotSupportedError');
  }
}

/**
 * Represents a Variant Also Negotiates error (HTTP 506).
 * Indicates that the server has an internal configuration error: the chosen variant resource is configured to engage in content negotiation itself, and is therefore not a proper end point in the negotiation process.
 *
 * @extends CustomError
 */
class VariantAlsoNegotiatesError extends CustomError {
  /**
   * Creates an instance of VariantAlsoNegotiatesError.
   *
   * @param {string} [message='Variant Also Negotiates.'] - The error message.
   */
  constructor(message = 'Variant Also Negotiates.') {
    super(message, 506, 'VariantAlsoNegotiatesError');
  }
}

/**
 * Represents an Insufficient Storage error (HTTP 507).
 * Indicates that the server is unable to store the representation needed to complete the request.
 *
 * @extends CustomError
 */
class InsufficientStorageError extends CustomError {
  /**
   * Creates an instance of InsufficientStorageError.
   *
   * @param {string} [
   *   message='The server is unable to store the representation needed to complete the request.'
   * ] - The error message.
   */
  constructor(
    message = 'The server is unable to store the representation needed to complete the request.',
  ) {
    super(message, 507, 'InsufficientStorageError');
  }
}

/**
 * Represents a Bandwidth Limit Exceeded error (HTTP 509).
 * Indicates that the bandwidth limit has been exceeded.
 *
 * @extends CustomError
 */
class BandwidthLimitExceededError extends CustomError {
  /**
   * Creates an instance of BandwidthLimitExceededError.
   *
   * @param {string} [message='Bandwidth limit exceeded.'] - The error message.
   */
  constructor(message = 'Bandwidth limit exceeded.') {
    super(message, 509, 'BandwidthLimitExceededError');
  }
}

/**
 * Represents a Network Authentication Required error (HTTP 511).
 * Indicates that network authentication is required to access the resource.
 *
 * @extends CustomError
 */
class NetworkAuthenticationRequiredError extends CustomError {
  /**
   * Creates an instance of NetworkAuthenticationRequiredError.
   *
   * @param {string} [
   *   message='Network authentication is required to access this resource.'
   * ] - The error message.
   */
  constructor(
    message = 'Network authentication is required to access this resource.',
  ) {
    super(message, 511, 'NetworkAuthenticationRequiredError');
  }
}

// Export all error classes for external use
module.exports = {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  PaymentRequiredError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  NotAcceptableError,
  RequestTimeoutError,
  ConflictError,
  PayloadTooLargeError,
  TooManyRequestsError,
  InternalServerError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError,
  HTTPVersionNotSupportedError,
  VariantAlsoNegotiatesError,
  InsufficientStorageError,
  BandwidthLimitExceededError,
  NetworkAuthenticationRequiredError,
};
