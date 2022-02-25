import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// import and initialize the Sentry module as early as possible, before initializing React:
Sentry.init({
  dsn: 'http://96f9570ea6224c899074dbbd37c53874@localhost:9000/2',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // 采样率
});
