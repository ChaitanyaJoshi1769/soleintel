import pino from 'pino';

const logger = pino();

export interface Metrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    avgResponseTime: number;
  };
  priceTracking: {
    lastRunAt: Date | null;
    lastRunDuration: number;
    productsTracked: number;
    alertsCreated: number;
  };
  alerts: {
    sent: number;
    unsent: number;
    failed: number;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
  };
}

export class MetricsCollector {
  private metrics: Metrics = {
    requests: {
      total: 0,
      successful: 0,
      failed: 0,
      avgResponseTime: 0,
    },
    priceTracking: {
      lastRunAt: null,
      lastRunDuration: 0,
      productsTracked: 0,
      alertsCreated: 0,
    },
    alerts: {
      sent: 0,
      unsent: 0,
      failed: 0,
    },
    errors: {
      total: 0,
      byType: {},
    },
  };

  private requestTimes: number[] = [];

  recordRequest(statusCode: number, responseTime: number): void {
    this.metrics.requests.total++;
    this.requestTimes.push(responseTime);

    if (statusCode >= 200 && statusCode < 300) {
      this.metrics.requests.successful++;
    } else if (statusCode >= 400) {
      this.metrics.requests.failed++;
    }

    // Keep only last 1000 request times for average calculation
    if (this.requestTimes.length > 1000) {
      this.requestTimes.shift();
    }

    // Update average response time
    this.metrics.requests.avgResponseTime =
      this.requestTimes.reduce((a, b) => a + b, 0) / this.requestTimes.length;
  }

  recordPriceTrackingRun(duration: number, productsTracked: number, alertsCreated: number): void {
    this.metrics.priceTracking.lastRunAt = new Date();
    this.metrics.priceTracking.lastRunDuration = duration;
    this.metrics.priceTracking.productsTracked += productsTracked;
    this.metrics.priceTracking.alertsCreated += alertsCreated;

    logger.info(
      {
        duration,
        productsTracked,
        alertsCreated,
        totalProducts: this.metrics.priceTracking.productsTracked,
      },
      'Price tracking run completed'
    );
  }

  recordAlertSent(): void {
    this.metrics.alerts.sent++;
  }

  recordAlertFailed(): void {
    this.metrics.alerts.failed++;
  }

  recordError(type: string): void {
    this.metrics.errors.total++;
    this.metrics.errors.byType[type] = (this.metrics.errors.byType[type] || 0) + 1;
  }

  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  getHealthStatus(): {
    healthy: boolean;
    status: string;
    metrics: Metrics;
  } {
    const errorRate = this.metrics.requests.total > 0 ?
      this.metrics.requests.failed / this.metrics.requests.total : 0;

    const healthy = errorRate < 0.1; // Less than 10% error rate
    const status = healthy ? 'healthy' : 'degraded';

    return {
      healthy,
      status,
      metrics: this.getMetrics(),
    };
  }

  reset(): void {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        avgResponseTime: 0,
      },
      priceTracking: {
        lastRunAt: null,
        lastRunDuration: 0,
        productsTracked: 0,
        alertsCreated: 0,
      },
      alerts: {
        sent: 0,
        unsent: 0,
        failed: 0,
      },
      errors: {
        total: 0,
        byType: {},
      },
    };
    this.requestTimes = [];
  }
}

// Singleton instance
let metricsCollector: MetricsCollector | null = null;

export function getMetricsCollector(): MetricsCollector {
  if (!metricsCollector) {
    metricsCollector = new MetricsCollector();
  }
  return metricsCollector;
}
