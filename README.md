
# Next.js Centralized Error Handler

![npm](https://img.shields.io/npm/v/nextjs-centralized-error-handler)
![npm downloads](https://img.shields.io/npm/dw/nextjs-centralized-error-handler)
![GitHub issues](https://img.shields.io/github/issues/riyons/nextjs-centralized-error-handler)
![GitHub license](https://img.shields.io/github/license/riyons/nextjs-centralized-error-handler)

A comprehensive error-handling package designed specifically for Next.js applications. This package provides centralized error handling through custom error classes and higher-order functions, solving common limitations in Next.js API routes. By serializing error messages in a frontend-compatible format, it enhances frontend-backend integration, making it easy to handle errors across the entire stack.

## Table of Contents

- [Features](#features)
- [Background](#background)
  - [What is Error Handling?](#what-is-error-handling)
  - [Challenges in Next.js API Routes](#challenges-in-nextjs-api-routes)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Setup](#basic-setup)
  - [Custom Error Classes](#custom-error-classes)
  - [Error Handler Options](#error-handler-options)
- [Examples](#examples)
- [Comparison with Other Packages](#comparison-with-other-packages)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [GitHub Repository](#github-repository)

---

## Features

### 1. Tailored for Next.js API Routes
   - **Higher-Order Error Handling**: Addresses Next.js’s lack of middleware support for API routes by using higher-order functions to handle errors. This approach provides centralized error management specifically tailored for Next.js.

### 2. Structured Custom Error Classes
   - **Customizable HTTP Error Classes**: Predefined error classes like `BadRequestError`, `UnauthorizedError`, and `NotFoundError` simplify error categorization, improving readability and maintainability.
   - **Scalability**: Developers can extend base classes to create custom errors, ensuring the codebase remains clean and organized.

### 3. Centralized Error Logging and Response Consistency
   - **Uniform Error Handling**: This package’s centralized approach to error logging and handling reduces redundancy across components, ensuring consistent responses and clear error tracking.

### 4. Frontend Compatibility
   - **JSON Serialization**: By structuring error messages in JSON, this package allows seamless frontend integration, providing user-friendly messages without exposing sensitive server details.
   - **Error Type Identification**: Serialized errors include type metadata, aiding frontend developers in providing precise and intuitive user feedback.

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

These classes simplify error creation without hardcoding status codes in each route:

```javascript
// Example: Throwing an UnauthorizedError
throw new UnauthorizedError(); // Defaults to "Unauthorized access. Please log in again."
```

#### Creating Custom Errors

Extend the base `CustomError` class to create your own error types:

```javascript
const { CustomError } = require('nextjs-centralized-error-handler');

class ConflictError extends CustomError {
  constructor(message = 'Resource conflict occurred.') {
    super(message, 409, 'ConflictError');
  }
}

throw new ConflictError();
```

### Error Handler Options

Configure `errorHandler` with options for custom logging, error formatting, and default messages:

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

### Enhanced Logging with Sentry

```javascript
const Sentry = require('@sentry/node');
const { errorHandler, InternalServerError } = require('nextjs-centralized-error-handler');

Sentry.init({ dsn: 'your-sentry-dsn' });

const handler = async (req, res) => {
  // Logic that could throw an InternalServerError
  throw new InternalServerError();
};

export default errorHandler(handler, { logger: Sentry.captureException });
```

---

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