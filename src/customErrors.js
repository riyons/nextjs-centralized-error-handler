// src/customErrors.js

class CustomError extends Error {
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

// Define predefined error classes

class BadRequestError extends CustomError {
  constructor(
    message = 'It seems there was an error with your request. Please check the data you entered and try again.',
  ) {
    super(message, 400, 'BadRequestError');
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized access. Please log in again.') {
    super(message, 401, 'UnauthorizedError');
  }
}

class PaymentRequiredError extends CustomError {
  constructor(message = 'Payment is required to access this resource.') {
    super(message, 402, 'PaymentRequiredError');
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Access denied.') {
    super(message, 403, 'ForbiddenError');
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'The requested resource was not found.') {
    super(message, 404, 'NotFoundError');
  }
}

class MethodNotAllowedError extends CustomError {
  constructor(
    message = 'The HTTP method used is not allowed for this resource.',
  ) {
    super(message, 405, 'MethodNotAllowedError');
  }
}

class NotAcceptableError extends CustomError {
  constructor(
    message = 'The requested resource is not available in a format acceptable to your browser.',
  ) {
    super(message, 406, 'NotAcceptableError');
  }
}

class RequestTimeoutError extends CustomError {
  constructor(message = 'The server timed out waiting for your request.') {
    super(message, 408, 'RequestTimeoutError');
  }
}

class ConflictError extends CustomError {
  constructor(
    message = 'A conflict occurred with the current state of the resource.',
  ) {
    super(message, 409, 'ConflictError');
  }
}

class PayloadTooLargeError extends CustomError {
  constructor(message = 'The request payload is too large.') {
    super(message, 413, 'PayloadTooLargeError');
  }
}

class TooManyRequestsError extends CustomError {
  constructor(
    message = 'You have made too many requests in a short period of time.',
  ) {
    super(message, 429, 'TooManyRequestsError');
  }
}

class InternalServerError extends CustomError {
  constructor(
    message = 'An internal server error occurred. Please try again later.',
  ) {
    super(message, 500, 'InternalServerError');
  }
}

class NotImplementedError extends CustomError {
  constructor(message = 'This functionality has not been implemented.') {
    super(message, 501, 'NotImplementedError');
  }
}

class BadGatewayError extends CustomError {
  constructor(
    message = 'Received an invalid response from the upstream server.',
  ) {
    super(message, 502, 'BadGatewayError');
  }
}

class ServiceUnavailableError extends CustomError {
  constructor(message = 'The service is currently unavailable.') {
    super(message, 503, 'ServiceUnavailableError');
  }
}

class GatewayTimeoutError extends CustomError {
  constructor(
    message = 'The upstream server failed to send a request in time.',
  ) {
    super(message, 504, 'GatewayTimeoutError');
  }
}

class HTTPVersionNotSupportedError extends CustomError {
  constructor(
    message = 'The server does not support the HTTP protocol version used in the request.',
  ) {
    super(message, 505, 'HTTPVersionNotSupportedError');
  }
}

class VariantAlsoNegotiatesError extends CustomError {
  constructor(message = 'Variant Also Negotiates.') {
    super(message, 506, 'VariantAlsoNegotiatesError');
  }
}

class InsufficientStorageError extends CustomError {
  constructor(
    message = 'The server is unable to store the representation needed to complete the request.',
  ) {
    super(message, 507, 'InsufficientStorageError');
  }
}

class BandwidthLimitExceededError extends CustomError {
  constructor(message = 'Bandwidth limit exceeded.') {
    super(message, 509, 'BandwidthLimitExceededError');
  }
}

class NetworkAuthenticationRequiredError extends CustomError {
  constructor(
    message = 'Network authentication is required to access this resource.',
  ) {
    super(message, 511, 'NetworkAuthenticationRequiredError');
  }
}

// Export all error classes
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
