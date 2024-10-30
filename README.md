
# Next.js Centralized Error Handler

![npm](https://img.shields.io/npm/v/nextjs-centralized-error-handler)
![npm downloads](https://img.shields.io/npm/dw/nextjs-centralized-error-handler)
![GitHub issues](https://img.shields.io/github/issues/riyons/nextjs-centralized-error-handler)
![GitHub license](https://img.shields.io/github/license/riyons/nextjs-centralized-error-handler)
![Build Status](https://github.com/riyons/nextjs-centralized-error-handler/actions/workflows/publish.yml/badge.svg)

**A comprehensive, secure error-handling package designed specifically for Next.js applications.** While Next.js 13 provides global middleware for high-level request interception, `nextjs-centralized-error-handler` enables **fine-grained, route-level error handling** with `custom error classes`, ensuring that error responses are both consistent and structured. The package simplifies error handling by removing the need for repetitive `try-catch` blocks, enhancing security by preventing sensitive data leakage, and making error responses frontend-compatible. Fully compatible with Next.js 13 and above.

## Table of Contents

- [Quick Start](#quick-start)
- [Why Use `nextjs-centralized-error-handler` with Next.js Middleware?](#why-use-nextjs-centralized-error-handler-with-nextjs-middleware)
- [Comparison with Next.js 13 Middleware](#comparison-with-nextjs-13-middleware)
- [Key Advantages of `nextjs-centralized-error-handler`](#key-advantages-of-nextjs-centralized-error-handler)
- [Traditional Approach vs. `nextjs-centralized-error-handler`](#traditional-approach-vs-nextjs-centralized-error-handler)
  - [Traditional Approach in Express (Using Middleware)](#traditional-approach-in-express-using-middleware)
  - [Using `nextjs-centralized-error-handler` in Next.js](#using-nextjs-centralized-error-handler-in-nextjs)
- [Features](#features)
- [Background](#background)
  - [What is Error Handling?](#what-is-error-handling)
  - [Challenges in Next.js API Routes](#challenges-in-nextjs-api-routes)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Setup](#basic-setup)
  - [Custom Error Classes](#custom-error-classes)
  - [Example Usage with Default Messages](#example-usage-with-default-messages)
  - [Creating Custom Errors](#creating-custom-errors)
  - [Using `nextjs-centralized-error-handler` with App Router](#using-nextjs-centralized-error-handler-with-app-router)
- [Customizing Error Handling Behavior](#customizing-error-handling-behavior)
  - [Error Handler Options](#error-handler-options)
  - [Customizing Error Responses](#customizing-error-responses)
- [Security Considerations](#security-considerations)
  - [Comprehensive Exception Handling](#comprehensive-exception-handling)
  - [Preventing Information Leakage](#preventing-information-leakage)
  - [Customizable Logging for Security and Monitoring](#customizable-logging-for-security-and-monitoring)
- [Examples](#examples)
- [Integration with Logging Services](#integration-with-logging-services)
  - [Enhanced Logging with Sentry](#enhanced-logging-with-sentry)
- [Benefits at a Glance](#benefits-at-a-glance)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [Conclusion](#conclusion)

---

## Quick Start

1. **Install the Package**

    ```bash
    npm install nextjs-centralized-error-handler
    # or
    yarn add nextjs-centralized-error-handler
    ```

2. **Wrap Your API Route Handler**

    ```javascript
    // pages/api/example.js

    const { errorHandler, BadRequestError } = require('nextjs-centralized-error-handler');

    const handler = async (req, res) => {
      if (!req.body.name) {
        throw new BadRequestError('Name is required.');
      }

      res.status(200).json({ message: 'Success' });
    };

    export default errorHandler(handler);
    ```

3. **Customize Error Handling (Optional)**

    ```javascript
    const handler = async (req, res) => {
      // Your logic here
    };

    const options = {
      logger: customLoggerFunction,
      defaultMessage: 'Something went wrong!',
      formatError: (error, req) => ({
        message: error.message,
        type: error.name,
        timestamp: new Date().toISOString(),
      }),
    };

    export default errorHandler(handler, options);
    ```

---

## Why Use `nextjs-centralized-error-handler` with Next.js Middleware?

Next.js 13’s middleware offers powerful global interception capabilities, ideal for tasks like authentication and general request validation. However, `nextjs-centralized-error-handler` enhances error handling by providing **fine-grained, route-level control** and detailed responses that middleware alone does not cover. Here’s how this package complements and extends Next.js middleware:

1. **Route-Specific Error Management**: With `nextjs-centralized-error-handler`, each route can define its own contextual error handling, with tailored messages that match the route’s functionality. This modularity is essential for complex applications with varied error handling needs across different endpoints.

2. **Custom Error Classes with Detailed Responses**: The package introduces `custom error classes` (e.g., `BadRequestError`, `UnauthorizedError`) with structured, frontend-friendly JSON responses. These responses are enriched with metadata like status codes and error types, ensuring predictable and standardized error handling for backend and frontend teams.

3. **Enhanced Security and Data Privacy**: Only errors that are intentional instances of `CustomError` have their status codes and messages sent to the client. For unexpected errors, a generic error message is used, and sensitive details are kept server-side, minimizing information leakage.

4. **Logging and Integration with Monitoring Tools**: Supports integration with logging services (e.g., Sentry, Datadog), enabling detailed error tracking and debugging beyond what middleware alone can achieve.

5. **Customizable and Extensible Error Handling**: The `CustomError` class is fully extensible, allowing developers to define application-specific errors, creating flexible error-handling strategies as applications evolve.

By combining Next.js middleware with `nextjs-centralized-error-handler`, you achieve a robust and flexible error-handling solution that supports both global and route-specific needs.

---

## Comparison with Next.js 13 Middleware

Next.js 13 introduces global middleware, enabling request-level interception for tasks such as authentication and general validation. Below is a comparison showing how Next.js 13 middleware differs from `nextjs-centralized-error-handler` and when to use each.

### Next.js 13 Middleware Example

Next.js 13 middleware can be defined globally and applied across all routes that match a specified pattern. This is useful for high-level operations like logging or authorization.

```javascript
// middleware.js (placed at the root of the app)

import { NextResponse } from 'next/server';

export function middleware(req) {
  // Example of request validation or general logging
  if (!req.headers.get('Authorization')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next(); // Continue to the route handler
}

// Optional: Configure route matching
export const config = {
  matcher: '/api/:path*', // Applies middleware only to /api/* routes
};
```

### Comparison with nextjs-centralized-error-handler

While Next.js middleware is useful for global, high-level tasks, `nextjs-centralized-error-handler` enables route-specific error handling with `custom error classes` for fine-grained control. Here’s how both work together:

| Feature                   | Next.js 13 Middleware            | nextjs-centralized-error-handler                    |
|---------------------------|----------------------------------|----------------------------------------------------|
| Scope                     | Global, based on route pattern matching | Route-specific, applied individually to each handler |
| Use Case                  | Authentication, global request validation | Detailed error handling, custom error messages       |
| Custom Error Responses    | Limited, generalized JSON responses  | Structured, frontend-compatible JSON responses      |
| Custom Error Classes      | ❌                               | ✅                                                 |
| Error Logging Integration | ❌                               | ✅ (supports Sentry, Datadog, etc.)                 |
| Fine-Grained Control      | ❌                               | ✅                                                 |
| Preventing Information Leakage | Limited, as it handles errors globally without distinguishing between error types | Enhanced, distinguishes between custom and unexpected errors to prevent sensitive data exposure |
| Integration with Route Handlers | Middleware runs before route handlers, cannot modify responses within handlers | Wraps individual route handlers, allowing for customized responses per route |
| Extensibility             | Limited to what middleware can handle globally | Highly extensible through `custom error classes` and configurable options |

### Understanding Scope and Flexibility: Next.js Middleware vs. `nextjs-centralized-error-handler`

While Next.js middleware provides a powerful mechanism for high-level request interception, `nextjs-centralized-error-handler` excels at fine-grained error handling within individual API routes. This section clarifies their distinct roles and how they can be used together effectively.

#### Scenario: User Input Validation

Imagine you are building an API route that requires a user's name to be provided in the request body. If the name is missing, you want to respond with a clear and specific error message. Let's see how each approach handles this scenario.

##### Using Next.js Middleware

In Next.js, middleware can be used to validate requests globally. However, it cannot catch exceptions thrown within individual route handlers.

```javascript
// middleware.js

import { NextResponse } from 'next/server';

export function middleware(req) {
  try {
    // You can include any logic here that might throw an error
    return NextResponse.next(); // Proceed to the route handler
  } catch (error) {
    // Handle the error and return an appropriate response
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
```
```javascript
// pages/api/example.js

const handler = async (req, res) => {
  if (!req.body.name) {
    throw new Error('Name is required.'); // This will not be caught by middleware
  }

  res.status(200).json({ message: `Hello, ${req.body.name}!` });
};

export default handler;
```

**What Happens Here:**

1. The middleware runs before the route handler to process the request.
2. If `req.body.name` is missing, the `Error` is thrown.
3. However, the middleware will not catch this error, resulting in a generic 500 Internal Server Error.

#### Using `nextjs-centralized-error-handler`

In contrast, `nextjs-centralized-error-handler` provides a higher-order function that captures errors thrown in route handlers.

```javascript
// pages/api/example.js

import { errorHandler, BadRequestError } from 'nextjs-centralized-error-handler';

const handler = async (req, res) => {
  if (!req.body.name) {
    throw new BadRequestError('Name is required.'); // This will be caught by errorHandler
  }

  res.status(200).json({ message: `Hello, ${req.body.name}!` });
};

export default errorHandler(handler);
```

**What Happens Here:**

1. The `errorHandler` wraps the route handler, intercepting any errors thrown within it.
2. If `req.body.name` is missing, the `BadRequestError` is thrown and caught by `errorHandler`.
3. This results in a structured response with the appropriate status code (400) and a clear error message ("Name is required.").

#### Why Use Both Approaches Together

Combining both Next.js middleware and `nextjs-centralized-error-handler` provides a comprehensive error-handling strategy:

- **Global Request Validation and Authentication:** Use Next.js middleware to handle tasks that need to be applied across multiple routes, such as authentication, authorization, and general request validation.
- **Route-Specific Detailed Error Handling:** Use `nextjs-centralized-error-handler` to manage errors that occur within individual route handlers, allowing for customized and structured error responses tailored to each route's specific needs.

### Example: Using Both Middleware and `nextjs-centralized-error-handler`

**Middleware (middleware.js):**

```javascript
// middleware.js (Next.js Middleware for global authentication)

import { NextResponse } from 'next/server';

export function middleware(req) {
  if (!req.headers.get('Authorization')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next(); // Continue to the route handler
}

export const config = {
  matcher: '/api/:path*', // Applies middleware only to /api/* routes
};
```

**Route Handler (pages/api/example.js):**

```javascript
// pages/api/example.js (Using nextjs-centralized-error-handler for route-specific errors)

const { errorHandler, BadRequestError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  if (!req.body.name) {
    throw new BadRequestError('Name is required.');
  }

  res.status(200).json({ message: 'Success' });
};

export default errorHandler(handler);
```

**Explanation:**

- **Middleware (middleware.js):** Handles global tasks like authentication. Applies to all `/api/*` routes based on the matcher configuration.
- **Route Handler (example.js):** Handles route-specific logic. Utilizes `nextjs-centralized-error-handler` for detailed error handling and structured responses.

By using Next.js middleware for request-level checks and `nextjs-centralized-error-handler` for response-level error handling, you achieve both broad validation and fine-grained error management.

---

### Key Advantages of `nextjs-centralized-error-handler`:

- **Centralized error handling** through a higher-order function.
- **Custom error classes** to simplify and standardize error categorization.
- **Frontend-compatible responses**, making it easier for Next.js-based frontends to parse and display error messages effectively.

---

## Traditional Approach vs. `nextjs-centralized-error-handler`

In traditional Node.js/Express applications, centralized error handling is often managed through middleware, which intercepts requests and errors consistently across routes. In Next.js, however, API routes don’t support middleware in the same way, creating challenges for centralized error handling. `nextjs-centralized-error-handler` fills this gap by using a higher-order function to provide route-specific error handling across all API routes.

### Traditional Approach in Express (Using Middleware)

In Express, centralized error handling is achieved through middleware functions, which allow for reusable error management across routes:

```javascript
// Traditional Express Approach

const express = require('express');
const app = express();

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
};

app.use('/api/example', (req, res, next) => {
  try {
    // Route handler logic
  } catch (error) {
    next(error); // Forward errors to centralized middleware
  }
}, errorHandler); // Centralized error handling middleware
```
In this approach, errors are passed to next(error), which then triggers centralized error-handling middleware to respond consistently across routes.

### Using `nextjs-centralized-error-handler` in Next.js

With `nextjs-centralized-error-handler`, you get middleware-like behavior tailored for Next.js through a higher-order function (errorHandler) that wraps route handlers, intercepting and managing errors at the route level:

```javascript
// Using nextjs-centralized-error-handler

const { errorHandler, BadRequestError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  if (!req.body.name) {
    // Throws a custom BadRequestError with a specific error message to inform the user
    throw new BadRequestError("Name is required.");
    
    // Alternatively, using the default error message:
    // throw new BadRequestError();
  }
};

export default errorHandler(handler);
```
With `nextjs-centralized-error-handler`, you avoid repetitive error-handling code in each route. Instead, `custom error classes` and the `errorHandler` higher-order function provide centralized, consistent error responses, simplifying maintenance and extending error handling across the entire application.

---

## Features

### 1. Centralized Error Handling
- **Higher-Order Error Handling**: The package uses a higher-order function, `errorHandler`, to centralize error handling across all API routes. Rather than requiring repetitive try-catch blocks, `errorHandler` intercepts errors, ensuring a consistent, JSON-formatted response structure for frontend integration.

### 2. Structured Custom Error Classes
- **Customizable HTTP Error Classes**: The package includes predefined classes like `BadRequestError`, `UnauthorizedError`, and `NotFoundError`, each mapped to an appropriate HTTP status code. This approach improves code readability and reduces redundancy, allowing developers to create additional custom error types by extending the base `CustomError` class.

### 3. JSON Serialization and Frontend Compatibility
- **Error Type Metadata**: Serialized error responses include metadata like error type, enabling the frontend to handle specific errors consistently. This enhances the user experience by delivering clear, actionable feedback, while also ensuring sensitive server details are not exposed.

---

## Background

### What is Error Handling?
Error handling ensures that an application can respond to unexpected conditions (e.g., invalid input, lack of access) gracefully. Instead of crashing, an application with robust error handling will provide helpful feedback to users and log errors for debugging.

### Challenges in Next.js API Routes

Next.js API routes support a global middleware approach, but they don’t natively support route-specific, fine-grained error handling like Express. Each route handler would otherwise need individual error management, leading to redundant code and inconsistent error responses. `nextjs-centralized-error-handler` addresses this by providing a higher-order function, `errorHandler`, that wraps route handlers to ensure consistent and centralized error handling at the route level.

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

Import `errorHandler` and `custom error classes` into your Next.js API route:

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

The package includes several predefined `error classes`:

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

To address specific needs beyond predefined classes, the package is designed to be extensible, allowing you to create unique custom errors for advanced use cases. You can extend the base `CustomError class` to define your own error types, tailored to specific business logic. Here are some examples of custom errors you might create:

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

---

### Using `nextjs-centralized-error-handler` with App Router

In addition to supporting traditional API routes, `nextjs-centralized-error-handler` can also be utilized with the App Router introduced in Next.js 13. Here’s how to implement error handling in your App Router using the package.

#### Example: Using `nextjs-centralized-error-handler` with the App Router

##### Creating a Route with Error Handling
You can create a route in your App Router and use the error handler to manage errors effectively.

```javascript
// app/api/hello/route.js

import { errorHandler, BadRequestError } from 'nextjs-centralized-error-handler';

const handler = async (req) => {
  const { name } = req.body;

  if (!name) {
    throw new BadRequestError('Name is required.'); // This error will be handled by the errorHandler
  }

  return new Response(JSON.stringify({ message: `Hello, ${name}!` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

// Wrap the handler with errorHandler for centralized error management

export const GET = errorHandler(handler);
export const POST = errorHandler(handler); // Example for handling POST requests
```

#### Explanation

- **Handler Function**: The handler function processes incoming requests. It checks for a `name` parameter and throws a `BadRequestError` if it's missing.
- **Error Handling**: The handler is wrapped with `errorHandler`, which captures any errors thrown during execution and returns a structured error response.

#### Error Handling in App Router

Using the App Router allows for a clean and structured way to manage errors while leveraging the powerful capabilities of `nextjs-centralized-error-handler`. By combining both, you ensure that your application handles errors effectively, regardless of the routing method used.

---

## Customizing Error Handling Behavior
Beyond custom errors, this package allows developers to fully control the behavior of error handling by:

- **Custom Logging**: You can plug in any logging function to track errors. This includes integrating external services (e.g., Sentry, LogRocket) or custom loggers.
- **Error Message Formatting**: Use `formatError` to add custom fields (e.g., requestId, timestamp).
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
  formatError: (error, req) => ({
    message: error.message,
    type: error.name,
    timestamp: new Date().toISOString(),
    path: req.url, // Adds request URL path to the error response
  }),
};

export default errorHandler(handler, options);
```

### Additional Examples for formatError
The `formatError` function is highly flexible, allowing you to create detailed and structured error responses that fit your application’s requirements. Below are some example configurations showcasing the versatility of `formatError`:

#### Adding User and Request Information

```javascript
const formatError = (error, req) => ({
  message: error.message,
  type: error.name,
  timestamp: new Date().toISOString(),
  path: req.url,
  userId: req.user?.id || 'guest', // Captures user ID if available
  requestId: req.headers['x-request-id'] || 'N/A', // Useful for tracing requests
});
```

#### Including Detailed Stack Trace for Development

```javascript
const formatError = (error, req) => ({
  message: error.message,
  type: error.name,
  timestamp: new Date().toISOString(),
  stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Include stack trace only in development
});
```

#### Integrating Application Metadata

```javascript
const formatError = (error, req) => ({
  message: error.message,
  type: error.name,
  timestamp: new Date().toISOString(),
  appVersion: process.env.APP_VERSION || '1.0.0', // Adding application version to help track error sources
  environment: process.env.NODE_ENV,
});
```

### Customizing Error Responses
The `formatError` function provides the flexibility to add or omit fields based on your requirements, making it easy to generate structured, informative error responses. These options make the package adaptable to diverse applications by providing developers the ability to standardize error messaging and traceability across their API.

---

## Security Considerations

### Comprehensive Exception Handling
The `errorHandler` higher-order function wraps each route handler individually, capturing **all exceptions**—both expected and unexpected—without requiring repetitive `try-catch` blocks. This approach ensures that even third-party or unforeseen errors are intercepted, allowing for consistent and secure error responses across all routes.

### Preventing Information Leakage

To protect sensitive data, our package distinguishes between intentional, known errors (e.g., `CustomError` instances) and unexpected errors:

- **Custom Errors Only**: Only errors created as instances of `CustomError` (or its subclasses) include their `statusCode` and `message` in the client response, providing clear, user-friendly error feedback for known issues.

- **Generic Handling of Unexpected Errors**: For errors that aren’t instances of `CustomError`—such as third-party library issues or unforeseen server errors—`errorHandler` automatically applies a status code of 500 and a generic message ("An internal server error occurred"). This prevents sensitive information from being inadvertently exposed to clients.

### Customizable Logging for Security and Monitoring

While keeping responses to the client secure and generalized, `errorHandler` also supports server-side logging. This allows unexpected errors to be logged and monitored internally without revealing details to the client, combining security with effective error tracking.

### Example: Handling Unexpected Errors Safely
Consider an API route that relies on a third-party library, which may throw errors we can’t predict:

```javascript
const { errorHandler } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  // An error from a third-party library
  await thirdPartyLibrary.doSomething(); // Throws an unexpected error
};

export default errorHandler(handler);
```

### What Happens Under the Hood
If `thirdPartyLibrary.doSomething()` throws an error that isn’t a `CustomError`, `errorHandler` will:

1. **Set `statusCode`** to 500 (or the configured `defaultStatusCode`).
2. **Set `message`** to "An internal server error occurred. Please try again later." (or `defaultMessage` if configured).
3. **Prevent Information Leakage**: Ensures no sensitive details (e.g., the original error message or stack trace) are sent to the client.
4. **Log the Error Server-Side**: Uses the provided logger for internal monitoring to record the error.

### Note on Error Handling Strategy
The `errorHandler` function distinguishes between custom errors and unexpected errors:

- **Custom Errors (`CustomError` instances)**: The specific `statusCode` and `message` you define are sent to the client, offering clear and user-friendly feedback for known issues.
- **Other Errors**: A default `statusCode` and message are used to safeguard against information leakage from unexpected errors.

By catching all errors in this way, `nextjs-centralized-error-handler` provides a robust, secure, and unified error-handling solution tailored for Next.js applications, with built-in protections to prevent unintended data exposure.

---

## Examples
Below are real-world scenarios demonstrating how `nextjs-centralized-error-handler` can simplify error handling across various use cases.

> **Note**: If an error is instantiated without a specific message, a default, user-friendly message is provided automatically.

### 1. Handling Different HTTP Methods
**Use Case**: Ensure that only specific HTTP methods (e.g., POST) are allowed for an API route and provide a meaningful error message if the method is incorrect.

In this example, `MethodNotAllowedError` is thrown if the incoming request uses any method other than POST, ensuring consistent, user-friendly feedback. If no custom message is provided, the default message, "Method not allowed," will be used.

```javascript
const { errorHandler, MethodNotAllowedError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowedError(); // Uses default message
  }

  // Logic for handling POST requests
  res.status(200).json({ message: 'POST request successful' });
};

export default errorHandler(handler);
```

### 2. Validating Request Parameters
**Use Case**: Check for the presence of required parameters in the request and respond with a structured error if validation fails.

Here, `BadRequestError` is thrown when a required parameter (`name`) is missing. If no custom message is specified, the default message, "It seems there was an error with your request," is used.

```javascript
const { errorHandler, BadRequestError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new BadRequestError(); // Uses default message
  }

  // Continue processing if name is provided
  res.status(200).json({ message: `Hello, ${name}!` });
};

export default errorHandler(handler);
```

### 3. Handling Unauthorized Access
**Use Case**: Restrict access to authorized users only. If the user is not authenticated, respond with an `UnauthorizedError` to signal unauthorized access.

In this example, `UnauthorizedError` is used to ensure only authenticated users can access the route. If no custom message is provided, it defaults to "Unauthorized access. Please log in."

```javascript
const { errorHandler, UnauthorizedError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  const { isAuthenticated } = req;

  if (!isAuthenticated) {
    throw new UnauthorizedError(); // Uses default message
  }

  res.status(200).json({ message: 'Welcome, authenticated user!' });
};

export default errorHandler(handler);
```

### 4. Enforcing Payload Limits
**Use Case**: Reject requests that contain a payload exceeding a defined size, helping to prevent misuse or denial-of-service attacks.

If the payload exceeds a specific limit, `PayloadTooLargeError` is thrown to inform the client. Without a custom message, the default message, "Request entity too large," will be displayed.

```javascript
const { errorHandler, PayloadTooLargeError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  const MAX_PAYLOAD_SIZE = 1024 * 1024; // 1 MB

  if (req.headers['content-length'] > MAX_PAYLOAD_SIZE) {
    throw new PayloadTooLargeError(); // Uses default message
  }

  res.status(200).json({ message: 'Payload accepted.' });
};

export default errorHandler(handler);
```

### 5. Customizing Error Responses (Advanced)
If you want to include additional metadata or customize error responses, `nextjs-centralized-error-handler` allows you to define a `formatError` function. This function can be tailored to include extra fields, such as request paths or timestamps.

For full details, see the [Customizing Error Handling Behavior](#customizing-error-handling-behavior) section. Here's a quick example:

```javascript
const { errorHandler, InternalServerError } = require('nextjs-centralized-error-handler');

const handler = async (req, res) => {
  throw new InternalServerError("Custom error occurred.");
};

const options = {
  formatError: (error, req) => ({
    message: error.message,
    type: error.name,
    timestamp: new Date().toISOString(),
    path: req.url,
  })
};

export default errorHandler(handler, options);
```

---

## Integration with Logging Services
To enhance observability, `nextjs-centralized-error-handler` supports custom logging through any service, such as Sentry, Datadog, or a custom logging solution. By passing a logging function (such as `Sentry.captureException`) to `errorHandler`, you can monitor errors in real-time while ensuring security and efficiency.

### What is a Custom Logger?
A "custom logger" is any logging function or external service (such as `console.log`, `Sentry.captureException`, or a custom implementation) that you provide to `errorHandler` to log errors server-side. This logging function is not part of `nextjs-centralized-error-handler` itself, but the package is designed to integrate seamlessly with the logger of your choice.

### Best Practices for Secure Logging
- **Avoid Logging Sensitive Data**: Ensure that your custom logger does not inadvertently log sensitive user data, such as credentials or personal details. Limit logs to essential error information only to maintain security and compliance with data protection standards.

### Enhanced Logging with Sentry
If you’re using Sentry, a popular monitoring tool, you can integrate it with this package for production error tracking:

> **Note on Sentry**: Sentry helps developers track, debug, and resolve issues in real time. Integrating Sentry with `nextjs-centralized-error-handler` allows you to log errors in production, providing insight into where and why failures occur without exposing sensitive details.

The example below demonstrates how to use Sentry’s `captureException` function as a logger with `errorHandler`.

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

This setup captures errors for monitoring, while safeguarding against exposing sensitive information to clients. By leveraging custom loggers, `nextjs-centralized-error-handler` combines robust security with effective error tracking, ensuring a secure and observable application environment.

---

## Benefits at a Glance
- **Tailored for Next.js**: Handles Next.js API route limitations with centralized error handling.
- **Custom Error Classes**: Predefined and extensible classes for structured error management.
- **JSON-Formatted Responses**: Frontend-compatible and metadata-enriched error messages.
- **Customizable Logging**: Integration with third-party logging services for error monitoring.
- **Seamless Integration**: Quickly adaptable to existing Next.js applications.

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

## Frequently Asked Questions (FAQ)

### Does this package support both Next.js API routes and the App Router?

Yes, `nextjs-centralized-error-handler` is designed to work seamlessly with both traditional Next.js API routes and the newer App Router introduced in Next.js 13.

### Can I use this package with TypeScript?

Absolutely! The package is fully compatible with TypeScript. Here's an example of how to use it in a TypeScript API route:

```typescript
// pages/api/example.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { errorHandler, BadRequestError } from 'nextjs-centralized-error-handler';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.name) {
    throw new BadRequestError('Name is required.');
  }

  res.status(200).json({ message: 'Success' });
};

export default errorHandler(handler);
```

---

## Conclusion

While Next.js 13 middleware offers global request interception, `nextjs-centralized-error-handler` provides **fine-grained, route-level control over error responses**, which is essential for applications that require specific error messages, robust security, and structured JSON responses. Together, they deliver a comprehensive error-handling solution across the entire application, benefiting both developers and end-users through consistent, secure, and efficient error management.

---