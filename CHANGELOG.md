
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.17] - 2024-11-01

### Added

- **Enhanced Test Suite:**
  - Expanded the test suite with additional test cases covering more scenarios for both **API Routes** and **App Router** contexts.
  - Introduced new custom error classes (e.g., `NotFoundError`) to handle a broader range of HTTP errors.
  
- **Documentation Improvements:**
  - Enhanced code comments and documentation across the codebase for better clarity and maintainability.

### Fixed

- **Application Stability:**
  - Resolved a critical issue where the application would crash if the `logger` function was undefined. Implemented proper validation and fallback mechanisms in the `errorHandler` to ensure graceful error handling even when optional configurations are missing or incorrect.

### Changed

- **Error Handling Logic:**
  - Improved the `errorHandler` implementation to better differentiate between **API Routes** and **App Router** contexts, ensuring appropriate response structures and status codes.
  - Updated the `errorHandler` to safely invoke custom logging and formatting functions, preventing potential crashes from malformed user-provided functions.

## [1.0.10] - 2024-10-30
### Fixed
- Corrected log message for errors in API Route handling to reflect 'API Route Error:' instead of 'Route Error:' in the logger.
- Ensured consistent error handling for both API Routes and App Router by refining the errorHandler implementation.

## [1.0.9] - 2024-10-30
### Fixed
- Enhanced the `errorHandler` function to support both API Routes and App Router in Next.js, allowing for flexible error handling across different route types.
- Adjusted error response handling to ensure appropriate responses are returned based on the presence of `res` in the request.

## [1.0.1] - 2024-10-29
### Added
- Option to customize error responses using `formatError`.
- Improved error handling for unsupported HTTP methods.
- Expanded documentation in the README.

## [1.0.0] - 2024-10-29
### Added
- Initial release of the package.
- Implemented centralized error handling using higher-order functions.
- Added custom error classes: `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `InternalServerError`, and `MethodNotAllowedError`.
- Enabled JSON serialization for frontend-compatible error responses.
- Added support for logging services like Sentry.