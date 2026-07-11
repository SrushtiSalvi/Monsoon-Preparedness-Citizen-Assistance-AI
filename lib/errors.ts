import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

// API response formatter
export function apiResponse<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(data, { status: statusCode });
}

// Error response formatter
export function errorResponse(error: unknown, statusCode: number = 500) {
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const issues = 'issues' in error && Array.isArray((error as { issues?: Array<{ path: (string | number)[]; message: string }> }).issues)
      ? (error as { issues: Array<{ path: (string | number)[]; message: string }> }).issues
      : (error as { errors?: Array<{ path: (string | number)[]; message: string }> }).errors ?? [];
    const formatted = issues.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return NextResponse.json(
      { error: 'Validation failed', code: 'VALIDATION_ERROR', details: formatted },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    message = error.message;
  }

  console.error('[API Error]', error);

  return NextResponse.json(
    { error: message, code },
    { status: statusCode }
  );
}

// Server action error handler
export function handleServerActionError(error: unknown) {
  if (error instanceof AppError) {
    throw new Error(`${error.code}: ${error.message}`);
  }

  if (error instanceof ZodError) {
    const issues = 'issues' in error && Array.isArray((error as { issues?: Array<{ path: (string | number)[]; message: string }> }).issues)
      ? (error as { issues: Array<{ path: (string | number)[]; message: string }> }).issues
      : (error as { errors?: Array<{ path: (string | number)[]; message: string }> }).errors ?? [];
    const formatted = issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
    throw new Error(`Validation failed: ${formatted}`);
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error('An unexpected error occurred');
}
