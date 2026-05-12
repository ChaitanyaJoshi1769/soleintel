import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import pino from 'pino';

const logger = pino();

export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  debug: boolean;
}

export function initializeSentry(config: SentryConfig): void {
  if (!config.dsn) {
    logger.warn('Sentry DSN not provided, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    tracesSampleRate: config.tracesSampleRate,
    debug: config.debug,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Postgres(),
      new Tracing.Integrations.Redis(),
    ],
    beforeSend(event, hint) {
      // Filter out certain errors
      if (event.exception) {
        const error = hint.originalException;

        // Ignore 404s
        if (error instanceof Error && error.message?.includes('not found')) {
          return null;
        }

        // Ignore validation errors that are expected
        if (error instanceof Error && error.message?.includes('validation')) {
          return null;
        }
      }

      return event;
    },
  });

  logger.info('Sentry initialized for error tracking');
}

export function captureException(error: Error, context?: Record<string, any>): string {
  logger.error({ err: error, context }, 'Captured exception');

  if (context) {
    Sentry.captureException(error, {
      contexts: { custom: context },
    });
  } else {
    Sentry.captureException(error);
  }

  return Sentry.lastEventId();
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): string {
  logger.info({ message, level }, 'Captured message');
  Sentry.captureMessage(message, level);
  return Sentry.lastEventId();
}

export function addBreadcrumb(
  message: string,
  category: string = 'default',
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

export function setUser(userId: string, userData?: Record<string, any>): void {
  Sentry.setUser({
    id: userId,
    ...userData,
  });
}

export function clearUser(): void {
  Sentry.setUser(null);
}

export function setContext(name: string, context: Record<string, any>): void {
  Sentry.setContext(name, context);
}

export async function flush(timeout: number = 5000): Promise<boolean> {
  return await Sentry.close(timeout);
}

// Fastify middleware for Sentry
export const sentryMiddleware = Sentry.Handlers.errorHandler();
