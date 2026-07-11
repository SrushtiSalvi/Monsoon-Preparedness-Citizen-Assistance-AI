import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV;

if (SENTRY_DSN && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    tracesSampleRate: 0.1,
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    attachStacktrace: true,
    beforeSend(event, hint) {
      // Filter out certain errors
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error) {
          // Don't send network errors
          if (error.message.includes('ECONNREFUSED')) return null;
          // Don't send abort errors
          if (error.message.includes('AbortError')) return null;
        }
      }
      return event;
    },
  });
}

export default Sentry;
