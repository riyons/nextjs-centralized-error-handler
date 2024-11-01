// tests/errorHandler.test.js

const errorHandler = require('../src/errorHandler');
const {
  BadRequestError,
  NotFoundError,
  CustomError,
} = require('../src/customErrors');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe('errorHandler - API Routes', () => {
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

  test('should handle different custom errors correctly', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      throw new NotFoundError('Resource not found.');
    };

    await errorHandler(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Resource not found.',
        type: 'NotFoundError',
      },
    });
  });

  test('should handle non-error objects gracefully', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      throw { message: 'Non-error object', code: 123 };
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

  test('should ignore additional properties in errors', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      const error = new Error('Test error with extra properties.');
      error.statusCode = 400;
      error.extra = 'extraProperty';
      throw error;
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
});

describe('errorHandler - Custom Logger', () => {
  test('should use the custom logger function (API Routes)', async () => {
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

    expect(mockLogger).toHaveBeenCalledWith(
      'API Route Error:',
      expect.any(Error),
    );
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('should use the custom logger function in App Router', async () => {
    const req = { url: '/api/test' };

    const handler = async () => {
      throw new Error('App Router test error.');
    };

    const mockLogger = jest.fn();

    const res = null; // No res object for App Router

    const mockResponse = await errorHandler(handler, { logger: mockLogger })(
      req,
      res,
    );

    expect(mockLogger).toHaveBeenCalledWith('Route Error:', expect.any(Error));
    expect(mockResponse.status).toBe(500);
    const body = await mockResponse.json();
    expect(body).toEqual({
      error: {
        message: 'An internal server error occurred. Please try again later.',
        type: 'Error',
      },
    });
  });
});

describe('errorHandler - App Router', () => {
  test('should handle custom errors correctly', async () => {
    const req = { url: '/api/test' };

    const handler = async (req) => {
      throw new CustomError('Test custom error.', 400, 'BadRequestError');
    };

    const res = null; // No res object for App Router

    // Mock Response object
    const mockResponse = await errorHandler(handler)(req, res);

    expect(mockResponse.status).toBe(400);
    expect(mockResponse.headers.get('Content-Type')).toBe('application/json');
    const body = await mockResponse.json();
    expect(body).toEqual({
      error: {
        message: 'Test custom error.',
        type: 'BadRequestError',
      },
    });
  });

  test('should handle unexpected errors with default status and message', async () => {
    const req = { url: '/api/test' };

    const handler = async (req) => {
      throw new Error('Unexpected error.');
    };

    const res = null; // No res object for App Router

    // Mock Response object
    const mockResponse = await errorHandler(handler)(req, res);

    expect(mockResponse.status).toBe(500);
    expect(mockResponse.headers.get('Content-Type')).toBe('application/json');
    const body = await mockResponse.json();
    expect(body).toEqual({
      error: {
        message: 'An internal server error occurred. Please try again later.',
        type: 'Error',
      },
    });
  });

  test('should use custom formatError function in App Router', async () => {
    const req = { url: '/api/test', headers: { 'x-request-id': 'abc123' } };

    const handler = async () => {
      throw new BadRequestError('Invalid input.');
    };

    const formatError = (error, req) => ({
      message: error.message,
      type: error.name,
      requestId: req.headers['x-request-id'],
    });

    const res = null; // No res object for App Router

    const mockResponse = await errorHandler(handler, { formatError })(req, res);

    expect(mockResponse.status).toBe(400);
    expect(mockResponse.headers.get('Content-Type')).toBe('application/json');
    const body = await mockResponse.json();
    expect(body).toEqual({
      message: 'Invalid input.',
      type: 'BadRequestError',
      requestId: 'abc123',
    });
  });

  test('should return 204 No Content if handler does not return a response (App Router)', async () => {
    const req = { url: '/api/test' };

    const handler = async () => {
      // No return statement
    };

    const res = null; // No res object for App Router

    const mockResponse = await errorHandler(handler)(req, res);

    expect(mockResponse.status).toBe(204);
    expect(mockResponse.headers.get('Content-Type')).toBeNull();
    const body = await mockResponse.text();
    expect(body).toBe('');
  });

  test('should set Content-Type to application/json for JSON responses (App Router)', async () => {
    const req = { url: '/api/test' };

    const handler = async () => {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const res = null; // No res object for App Router

    const mockResponse = await errorHandler(handler)(req, res);

    expect(mockResponse.status).toBe(200);
    expect(mockResponse.headers.get('Content-Type')).toBe('application/json');
  });
});

describe('errorHandler - Security', () => {
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

describe('errorHandler - Invalid `formatError` Function', () => {
  test('should fallback to default error response if formatError is not a function', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const handler = async () => {
      throw new BadRequestError('Test bad request.');
    };

    const invalidFormatError = 'not a function';

    await errorHandler(handler, { formatError: invalidFormatError })(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Test bad request.',
        type: 'BadRequestError',
      },
    });
  });
});
