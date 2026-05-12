import pino from 'pino';
import nodemailer from 'nodemailer';

const logger = pino();

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface PriceDropAlert {
  userEmail: string;
  productTitle: string;
  productUrl: string;
  retailer: string;
  oldPrice: number;
  newPrice: number;
  priceDropPercent: number;
  targetPrice?: number;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;

  constructor(config?: EmailConfig) {
    if (config) {
      this.config = config;
      this.initializeTransporter();
    }
  }

  private initializeTransporter(): void {
    if (!this.config) {
      logger.warn('Email service not configured');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
    });

    logger.info('Email service initialized');
  }

  async sendPriceDropAlert(alert: PriceDropAlert): Promise<boolean> {
    if (!this.transporter || !this.config) {
      logger.warn('Email service not configured, skipping notification');
      return false;
    }

    try {
      const savingsAmount = alert.oldPrice - alert.newPrice;
      const savingsPercent = alert.priceDropPercent.toFixed(1);

      const htmlContent = `
        <h2>Price Drop Alert! 🎉</h2>
        <p>Great news! The price of a product you're watching has dropped.</p>

        <h3>${alert.productTitle}</h3>
        <p><strong>Retailer:</strong> ${alert.retailer}</p>

        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
          <p style="margin: 0;">
            <strong>Old Price:</strong> $${alert.oldPrice.toFixed(2)}<br>
            <strong>New Price:</strong> <span style="color: green; font-size: 18px;">$${alert.newPrice.toFixed(2)}</span><br>
            <strong>You Save:</strong> <span style="color: green;">$${savingsAmount.toFixed(2)} (${savingsPercent}%)</span>
          </p>
        </div>

        ${alert.targetPrice ? `<p><strong>Target Price Met:</strong> Product is now below your target of $${alert.targetPrice.toFixed(2)}</p>` : ''}

        <p><a href="${alert.productUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Product</a></p>

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #999;">
          You received this email because you added this product to your watchlist on SOLEINTEL.<br>
          <a href="https://soleintel.com/unsubscribe">Unsubscribe from price alerts</a>
        </p>
      `;

      const textContent = `
        Price Drop Alert!

        ${alert.productTitle}
        Retailer: ${alert.retailer}

        Old Price: $${alert.oldPrice.toFixed(2)}
        New Price: $${alert.newPrice.toFixed(2)}
        You Save: $${savingsAmount.toFixed(2)} (${savingsPercent}%)

        ${alert.targetPrice ? `Target Price Met: Product is now below your target of $${alert.targetPrice.toFixed(2)}` : ''}

        View product: ${alert.productUrl}
      `;

      await this.transporter.sendMail({
        from: this.config.from,
        to: alert.userEmail,
        subject: `Price Drop: ${alert.productTitle} - $${savingsAmount.toFixed(2)} Off!`,
        text: textContent,
        html: htmlContent,
      });

      logger.info(`Price drop alert sent to ${alert.userEmail}`);
      return true;
    } catch (err) {
      logger.error({ err }, `Failed to send price drop alert to ${alert.userEmail}`);
      return false;
    }
  }

  async sendWatchlistSummary(
    userEmail: string,
    products: Array<{
      title: string;
      currentPrice: number;
      lowestPrice: number;
      priceDropPercent: number;
    }>
  ): Promise<boolean> {
    if (!this.transporter || !this.config) {
      logger.warn('Email service not configured, skipping summary');
      return false;
    }

    try {
      const productRows = products
        .map(
          (p) => `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px;">${p.title}</td>
          <td style="padding: 10px;">$${p.currentPrice.toFixed(2)}</td>
          <td style="padding: 10px;">$${p.lowestPrice.toFixed(2)}</td>
          <td style="padding: 10px; color: green;">${p.priceDropPercent.toFixed(1)}%</td>
        </tr>
      `
        )
        .join('');

      const htmlContent = `
        <h2>Your SOLEINTEL Watchlist Summary</h2>
        <p>Here's a summary of the ${products.length} products you're tracking:</p>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="text-align: left; padding: 10px;">Product</th>
              <th style="text-align: left; padding: 10px;">Current Price</th>
              <th style="text-align: left; padding: 10px;">Lowest Price</th>
              <th style="text-align: left; padding: 10px;">Discount</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>

        <p style="margin-top: 20px;"><a href="https://soleintel.com/watchlist" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Watchlist</a></p>
      `;

      await this.transporter.sendMail({
        from: this.config.from,
        to: userEmail,
        subject: `SOLEINTEL Watchlist Summary - ${products.length} items tracked`,
        html: htmlContent,
      });

      logger.info(`Watchlist summary sent to ${userEmail}`);
      return true;
    } catch (err) {
      logger.error({ err }, `Failed to send watchlist summary to ${userEmail}`);
      return false;
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      logger.error('Email service not initialized');
      return false;
    }

    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (err) {
      logger.error({ err }, 'Email service connection failed');
      return false;
    }
  }
}

// Singleton instance
let emailService: EmailService | null = null;

export function getEmailService(config?: EmailConfig): EmailService {
  if (!emailService) {
    emailService = new EmailService(config);
  }
  return emailService;
}
