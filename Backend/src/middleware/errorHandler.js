import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isProd = env.NODE_ENV === 'production';

  logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`, isProd ? '' : err.stack);

  let message = err.message || 'An unexpected internal error occurred.';
  let code = err.code || 'INTERNAL_SERVER_ERROR';

  // Zod validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload parameters.',
        details: err.errors?.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'DB_VALIDATION_ERROR',
        message: Object.values(err.errors).map((e) => e.message).join(', '),
      },
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(isProd ? {} : { stack: err.stack }),
    },
  });
};
