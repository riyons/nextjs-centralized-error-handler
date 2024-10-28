
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
  - [Further Examples](#further-examples)
  - [Custom Error Classes](#custom-error-classes)
  - [Advanced Usage: Extending Custom Errors](#advanced-usage-extending-custom-errors)
  - [Error Handler Options](#error-handler-options)
  - [Customizing Error Handling Behavior](#customizing-error-handling-behavior)
- [Integration with Logging Services](#integration-with-logging-services)
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