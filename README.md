
# Next.js Centralized Error Handler

![npm](https://img.shields.io/npm/v/nextjs-centralized-error-handler)
![npm downloads](https://img.shields.io/npm/dw/nextjs-centralized-error-handler)
![GitHub issues](https://img.shields.io/github/issues/riyons/nextjs-centralized-error-handler)
![GitHub license](https://img.shields.io/github/license/riyons/nextjs-centralized-error-handler)

A comprehensive error-handling package designed specifically for Next.js applications. This package provides centralized error handling through custom error classes and higher-order functions, solving common limitations in Next.js API routes. By serializing error messages in a frontend-compatible format, it enhances frontend-backend integration, making it easy to handle errors across the entire stack.

## Table of Contents

- [Problem Statement: Why This Package?](#problem-statement-why-this-package)
- [Features](#features)
- [How It Works: The Key Components](#how-it-works-the-key-components)
- [Background](#background)
  - [What is Error Handling?](#what-is-error-handling)
  - [Challenges in Next.js API Routes](#challenges-in-nextjs-api-routes)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Setup](#basic-setup)
  - [Custom Error Classes](#custom-error-classes)
  - [Example Usage with Default Messages](#example-usage-with-default-messages)
  - [Creating Custom Errors](#creating-custom-errors)
- [Customizing Error Handling Behavior](#customizing-error-handling-behavior)
  - [Error Handler Options](#error-handler-options)
  - [Customizing Error Responses](#customizing-error-responses)
- [Examples](#examples)
- [Integration with Logging Services](#integration-with-logging-services)
  - [Enhanced Logging with Sentry](#enhanced-logging-with-sentry)
- [Benefits at a Glance](#benefits-at-a-glance)
- [Comparison with Other Packages](#comparison-with-other-packages)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [GitHub Repository](#github-repository)
---

## Problem Statement: Why This Package?

Next.js is excellent for building fast, scalable web applications, but it has a limitation: API routes in Next.js don’t support traditional middleware in the same way Express does. This makes centralized error handling challenging, leading to redundant code across API routes and inconsistent error-handling practices.

Additionally, many developers prefer a structured way to handle errors using custom error classes—a feature commonly seen in frameworks like Yii2 but less standardized in Node.js applications. Without such structures, error handling in Node.js can involve repetitive, hardcoded responses in each route, increasing the risk of inconsistency and errors.

`nextjs-centralized-error-handler` addresses these issues by offering:
- **Centralized error handling** through a higher-order function.
- **Custom error classes** to simplify and standardize error categorization.
- **Frontend-compatible responses**, making it easier for Next.js-based frontends to parse and display error messages effectively.

---

## Traditional Approach vs. `nextjs-centralized-error-handler`

In the traditional approach, error handling often involves manually setting up status codes and error messages in each route. With `nextjs-centralized-error-handler`, you can centralize and simplify error handling, reducing redundancy and enhancing consistency.

### Traditional Approach

In a traditional setup, each route needs to manually define the error response, which can lead to repetitive code:

```javascript
// Traditional approach
const handler = async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: 'Bad Request: Name is required' });
  }
};
```

### Using `nextjs-centralized-error-handler`

With `nextjs-centralized-error-handler`, error handling is simplified and centralized. You can use predefined custom error classes to throw errors consistently, while the higher-order function `errorHandler` manages the response:

```javascript
// Using nextjs-centralized-error-handler
const { errorHandler, BadRequestError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  if (!req.body.name) {
    // Throws a custom BadRequestError with a specific error message to inform the user
    throw new BadRequestError("Name is required.");
    
    // Alternatively, you could use the default error message, which is:
    // throw new BadRequestError(); 
    // Defaults to: "It seems there was an error with your request. Please check the data you entered and try again."
  }
};

export default errorHandler(handler);
```

This approach not only reduces redundancy but also standardizes error responses, making it easier to maintain and extend error handling across the application.

---

## Features

### 1. Centralized Error Handling
- **Higher-Order Error Handling**: The package uses a higher-order function, `errorHandler`, to centralize error handling across all API routes. Rather than requiring repetitive try-catch blocks, `errorHandler` intercepts errors, ensuring a consistent, JSON-formatted response structure for frontend integration.

### 2. Structured Custom Error Classes
- **Customizable HTTP Error Classes**: The package includes predefined classes like `BadRequestError`, `UnauthorizedError`, and `NotFoundError`, each mapped to an appropriate HTTP status code. This approach improves code readability and reduces redundancy, allowing developers to create additional custom error types by extending the base `CustomError` class.

### 3. JSON Serialization and Frontend Compatibility
- **Error Type Metadata**: Serialized error responses include metadata like error type, enabling the frontend to handle specific errors consistently. This enhances the user experience by delivering clear, actionable feedback, while also ensuring sensitive server details are not exposed.

---

## How It Works: The Key Components

The package operates through three main components:

### a) Centralized Error Handling
By using the `errorHandler` higher-order function, this package centralizes error handling across all API routes. Wrapping route handlers with `errorHandler` eliminates the need for redundant try-catch blocks, intercepting errors and returning standardized, JSON-formatted responses to the frontend.

### b) Structured Custom Error Classes
With predefined classes like `BadRequestError`, `UnauthorizedError`, and `NotFoundError`, this package maps errors to appropriate HTTP status codes, enhancing readability and consistency. Developers can also extend the base `CustomError` class to create additional, customized error types.

### c) JSON Serialization and Frontend Compatibility
The `errorHandler` function serializes errors in JSON format with metadata like error type, making it easier for the frontend to process and display messages consistently. This allows Next.js-based frontends to provide users with clear and user-friendly feedback.

---

## Background

### What is Error Handling?
Error handling ensures that an application can respond to unexpected conditions (e.g., invalid input, lack of access) gracefully. Instead of crashing, an application with robust error handling will provide helpful feedback to users and log errors for debugging.

### Challenges in Next.js API Routes
Next.js API routes lack support for traditional middleware, making centralized error handling more complex. With Next.js, each route handler must manage its own errors, leading to redundant code. This package addresses this limitation by using a higher-order function, `errorHandler`, that wraps route handlers to provide consistent, centralized error handling.

---

## Installation

### Using npm

```bash
npm install nextjs-centralized-error-handler
```

### Using Yarn

```bash
yarn add nextjs-centralized-error-handler
```

---

## Usage

### Basic Setup

Import `errorHandler` and custom error classes into your Next.js API route:

```javascript
// pages/api/someEndpoint.js
const { errorHandler, BadRequestError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    throw new BadRequestError('Only GET requests are allowed.');
  }

  // Logic here
  res.status(200).json({ data: 'Success' });
};

export default errorHandler(handler);
```

### Custom Error Classes

The package includes several predefined error classes:

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `MethodNotAllowedError` (405)
- `InternalServerError` (500)
- `PaymentRequiredError` (402)
- `NotAcceptableError` (406)
- `RequestTimeoutError` (408)
- `PayloadTooLargeError` (413)
- `TooManyRequestsError` (429)
- `BadGatewayError` (502)
- `ServiceUnavailableError` (503)
- `GatewayTimeoutError` (504)
- `InsufficientStorageError` (507)
- `BandwidthLimitExceededError` (509)
- `NetworkAuthenticationRequiredError` (511)

These classes simplify error creation without hardcoding status codes in each route:

```javascript
// Example: Throwing an UnauthorizedError
throw new UnauthorizedError(); // Defaults to "Unauthorized access. Please log in again."
```

### Example Usage with Default Messages
If you simply instantiate an error without specifying a message, it defaults to a pre-defined, user-friendly message.

```javascript
throw new ForbiddenError(); // Defaults to "Access denied."
throw new ForbiddenError("Custom forbidden message."); // Uses custom message provided.
```

#### Creating Custom Errors

To address specific needs beyond predefined classes, the package is designed to be extensible, allowing you to create unique custom errors for advanced use cases. You can extend the base CustomError class to define your own error types, tailored to specific business logic. Here are some examples of custom errors you might create:

- `HTTPVersionNotSupportedError` (505)
- `NotImplementedError` (501)
- `VariantAlsoNegotiatesError` (506)
- `ConflictError` (409)

##### Example
```javascript
const { CustomError } = require('nextjs-centralized-error-handler');

// Define a custom ConflictError (HTTP 409) for resource conflicts
class ConflictError extends CustomError {
  constructor(message = 'Resource conflict occurred.') {
    super(message, 409, 'ConflictError');
  }
}

// Usage
throw new ConflictError();
```
This example defines a custom ConflictError (HTTP 409), which can be thrown in cases where a resource conflict occurs. Creating custom errors allows you to handle unique business logic or application-specific needs efficiently.

## Customizing Error Handling Behavior
Beyond custom errors, this package allows developers to fully control the behavior of error handling by:

- **Custom Logging**: You can plug in any logging function to track errors. This includes integrating external services (e.g., Sentry, LogRocket) or custom loggers.
- **Error Message Formatting**: Use formatError to add custom fields (e.g., requestId, timestamp).
- **Default Status and Messages**: Control defaults for unhandled errors, ensuring user-friendly feedback without exposing server details.

### Error Handler Options

You can configure the `errorHandler` with options for custom logging, error formatting, and default messages:

```javascript
const handler = async (req, res) => {
  // Handler logic
};

const options = {
  logger: customLoggerFunction, // Optional custom logger
  defaultStatusCode: 500,
  defaultMessage: 'Something went wrong!',
  formatError: (error) => ({
    message: error.message,
    type: error.name,
    timestamp: new Date().toISOString(),
  }),
};

export default errorHandler(handler, options);
```

This customization allows for detailed, structured responses that can include metadata like a timestamp, providing a richer error-handling experience for users and developers alike.

### Customizing Error Responses
Developers can pass a `formatError` function to customize how errors are returned. This function allows for adding additional metadata (e.g., timestamp) to the response.

---

## Examples

Here are a few real-world scenarios that showcase the package’s usage:

### Handling Different HTTP Methods

```javascript
const { errorHandler, MethodNotAllowedError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowedError('Only POST requests are allowed.');
  }

  // POST request handling logic
};

export default errorHandler(handler);
```

## Integration with Logging Services
To enhance observability, the package supports custom logging through any service, such as Sentry, Datadog, or custom logging solutions.

1. Set up your logging service (e.g., initialize Sentry or Datadog).
2. Pass the logging function (e.g., Sentry.captureException) to errorHandler as shown:

```javascript
// Wrap handler with errorHandler, using Sentry to capture exceptions
export default errorHandler(handler, { logger: Sentry.captureException });

This flexibility allows you to capture all API route errors within your preferred monitoring system, streamlining debugging and performance tracking.
```

### Enhanced Logging with Sentry
If you’re using Sentry, a popular logging service, you can integrate it with this package for error tracking:

> **Note**: Sentry is an external service for tracking and debugging errors in real-time. With Sentry, you can capture, monitor, and resolve errors across your application.

```javascript
const Sentry = require('@sentry/node');
const { errorHandler, InternalServerError } = require('nextjs-centralized-error-handler');

// Initialize Sentry with your DSN
Sentry.init({ dsn: 'your-sentry-dsn' });

const handler = async (req, res) => {
  // Logic that could throw an InternalServerError
  throw new InternalServerError();
};

// Wrap handler with errorHandler, using Sentry to capture exceptions
export default errorHandler(handler, { logger: Sentry.captureException });
```
By passing Sentry.captureException as the logger in errorHandler, this integration captures any errors for tracking and analysis.
---

## Benefits at a Glance
- **Tailored for Next.js**: Handles Next.js API route limitations with centralized error handling.
- **Custom Error Classes**: Predefined and extensible classes for structured error management.
- **JSON-Formatted Responses**: Frontend-compatible and metadata-enriched error messages.
- **Customizable Logging**: Integration with third-party logging services for error monitoring.
- **Seamless Integration**: Quickly adaptable to existing Next.js applications.

## Comparison with Other Packages

Here’s how `nextjs-centralized-error-handler` differs from other error packages like `http-errors`:

| Feature                                   | nextjs-centralized-error-handler | http-errors | express-error-handler | Custom Implementation |
|-------------------------------------------|----------------------------------|-------------|-----------------------|-----------------------|
| Tailored for Next.js API Routes           | ✅                               | ❌          | ❌                    | ❌                    |
| Custom Error Classes                      | ✅                               | ✅          | ✅                    | ✅                    |
| Centralized Error Handling                | ✅                               | ❌          | ✅                    | ❌                    |
| Frontend-Compatible Error Responses       | ✅                               | ❌          | ❌                    | ❌                    |
| Middleware Support                        | ✅                               | ❌          | ✅                    | ❌                    |
| Integration with Logging Services         | ✅                               | ❌          | ✅                    | ❌                    |

---

## Changelog

See the [CHANGELOG.md](https://github.com/riyons/nextjs-centralized-error-handler/blob/main/CHANGELOG.md) for details on version history and updates.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have suggestions for new features or improvements. For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

This project also adheres to a [Code of Conduct](CODE_OF_CONDUCT.md), so please review it before contributing.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

If you have any questions or need assistance, feel free to open an issue or contact me at [riyonsebastian@gmail.com](mailto:riyonsebastian@gmail.com).

[GitHub Repository](https://github.com/riyons/nextjs-centralized-error-handler)

---