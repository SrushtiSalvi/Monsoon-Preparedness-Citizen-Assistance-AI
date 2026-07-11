enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: any;
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : '';
    
    return {
      timestamp,
      level,
      message,
      context,
      formatted: `[${timestamp}] ${level}: ${message} ${contextStr}`,
    };
  }

  debug(message: string, context?: LogContext) {
    const log = this.formatLog(LogLevel.DEBUG, message, context);
    if (process.env.NODE_ENV === 'development') {
      console.log(log.formatted);
    }
  }

  info(message: string, context?: LogContext) {
    const log = this.formatLog(LogLevel.INFO, message, context);
    console.log(log.formatted);
  }

  warn(message: string, context?: LogContext) {
    const log = this.formatLog(LogLevel.WARN, message, context);
    console.warn(log.formatted);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      } : String(error),
    };

    const log = this.formatLog(LogLevel.ERROR, message, errorContext);
    console.error(log.formatted);

    // In production, you'd send this to a monitoring service like Sentry
    if (process.env.NODE_ENV === 'production' && error instanceof Error) {
      // TODO: Send to Sentry
    }
  }
}

export const logger = new Logger();

// Request logger middleware
export function createRequestLogger(req: Request) {
  const requestId = Math.random().toString(36).substring(2, 11);
  const startTime = Date.now();

  return {
    requestId,
    startTime,
    log: (message: string, context?: Omit<LogContext, 'requestId'>) => {
      logger.info(message, {
        requestId,
        ...context,
      });
    },
    logError: (message: string, error: unknown, context?: Omit<LogContext, 'requestId'>) => {
      logger.error(message, error, {
        requestId,
        ...context,
      });
    },
    logComplete: (statusCode: number, context?: Omit<LogContext, 'requestId' | 'statusCode' | 'duration'>) => {
      const duration = Date.now() - startTime;
      logger.info('Request completed', {
        requestId,
        statusCode,
        duration,
        ...context,
      });
    },
  };
}
