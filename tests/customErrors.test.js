// tests/customErrors.test.js

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} = require('../src/customErrors');

describe('Custom Error Classes', () => {
  test('BadRequestError should have correct properties', () => {
    const error = new BadRequestError();
    expect(error.name).toBe('BadRequestError');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      'It seems there was an error with your request. Please check the data you entered and try again.',
    );
  });

  test('UnauthorizedError should have correct properties', () => {
    const error = new UnauthorizedError('Custom unauthorized message.');
    expect(error.name).toBe('UnauthorizedError');
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Custom unauthorized message.');
  });

  test('ForbiddenError should have correct properties', () => {
    const error = new ForbiddenError();
    expect(error.name).toBe('ForbiddenError');
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Access denied.');
  });

  test('NotFoundError should have correct properties', () => {
    const error = new NotFoundError('Custom not found message.');
    expect(error.name).toBe('NotFoundError');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Custom not found message.');
  });

  test('InternalServerError should have correct properties', () => {
    const error = new InternalServerError();
    expect(error.name).toBe('InternalServerError');
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe(
      'An internal server error occurred. Please try again later.',
    );
  });
});
