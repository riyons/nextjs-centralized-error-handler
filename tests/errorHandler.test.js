// tests/errorHandler.test.js

const errorHandler = require('../src/errorHandler');
const { BadRequestError, CustomError } = require('../src/customErrors');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe('errorHandler', () => {
  test('should handle custom errors correctly', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      throw new BadRequestError('Test bad request.');
    };

    await errorHandler(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Test bad request.',
        type: 'BadRequestError',
      },
    });
  });

  test('should handle unexpected errors with default status and message', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      throw new Error('Unexpected error.');
    };

    await errorHandler(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'An internal server error occurred. Please try again later.',
        type: 'Error',
      },
    });
  });

  test('should use custom formatError function', async () => {
    const req = { headers: { 'x-request-id': '12345' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      throw new BadRequestError('Test bad request.');
    };

    const formatError = (error, req) => ({
      errorMessage: error.message,
      errorType: error.name,
      requestId: req.headers['x-request-id'],
    });

    await errorHandler(handler, { formatError })(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errorMessage: 'Test bad request.',
      errorType: 'BadRequestError',
      requestId: '12345',
    });
  });
});

describe('errorHandler with custom logger', () => {
  test('should use the custom logger function', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      throw new Error('Test error.');
    };

    const mockLogger = jest.fn();

    await errorHandler(handler, { logger: mockLogger })(req, res);

    expect(mockLogger).toHaveBeenCalledWith('API Route Error:', expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// tests/errorHandler.test.js

describe('errorHandler with custom formatError', () => {
  test('should format the error response using formatError function', async () => {
    const req = { url: '/api/test', headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      throw new BadRequestError('Test bad request.');
    };

    const formatError = (error, req) => ({
      message: error.message,
      type: error.name,
      path: req.url,
      customField: 'customValue',
    });

    await errorHandler(handler, { formatError })(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test bad request.',
      type: 'BadRequestError',
      path: '/api/test',
      customField: 'customValue',
    });
  });
});

describe('errorHandler security', () => {
  test('should use default status code and message for non-custom errors', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      const error = new Error('Sensitive internal error message');
      error.statusCode = 400; // Error with statusCode and message
      throw error;
    };

    await errorHandler(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(500); // Should use defaultStatusCode
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'An internal server error occurred. Please try again later.', // Should use defaultMessage
        type: 'Error',
      },
    });
  });
});