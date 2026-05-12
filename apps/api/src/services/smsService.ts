import twilio from 'twilio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

const client = twilio(accountSid, authToken);

export class SMSService {
  async sendPriceAlert(userId: string, phoneNumber: string, productTitle: string, price: number, savings: number) {
    try {
      const message = await client.messages.create({
        body: `🚨 ${productTitle} dropped to $${price.toFixed(2)}! You save $${savings.toFixed(2)}. Check it out now!`,
        from: fromNumber,
        to: phoneNumber,
      });

      // Log SMS notification
      await prisma.smsNotification.create({
        data: {
          userId,
          phoneNumber,
          message: message.body,
          sid: message.sid,
          status: 'sent',
        },
      });

      return { success: true, sid: message.sid };
    } catch (error) {
      console.error('SMS send error:', error);
      throw new Error(`Failed to send SMS: ${(error as Error).message}`);
    }
  }

  async sendWatchlistSummary(
    userId: string,
    phoneNumber: string,
    watchlistCount: number,
    priceDropCount: number,
  ) {
    try {
      const message = await client.messages.create({
        body: `📊 SOLEINTEL Update: ${watchlistCount} items tracked, ${priceDropCount} price drops found! Log in to see deals.`,
        from: fromNumber,
        to: phoneNumber,
      });

      await prisma.smsNotification.create({
        data: {
          userId,
          phoneNumber,
          message: message.body,
          sid: message.sid,
          status: 'sent',
        },
      });

      return { success: true, sid: message.sid };
    } catch (error) {
      console.error('SMS send error:', error);
      throw new Error(`Failed to send SMS: ${(error as Error).message}`);
    }
  }

  async validatePhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
      const validation = await client.lookups.v2.phoneNumbers(phoneNumber).fetch();
      return validation.valid === true;
    } catch {
      return false;
    }
  }

  async registerPhoneNumber(userId: string, phoneNumber: string) {
    // Validate phone number
    const isValid = await this.validatePhoneNumber(phoneNumber);
    if (!isValid) {
      throw new Error('Invalid phone number');
    }

    // Check if already registered
    const existing = await prisma.userPhoneNumber.findUnique({
      where: { userId },
    });

    if (existing) {
      // Update existing
      return await prisma.userPhoneNumber.update({
        where: { userId },
        data: { phoneNumber, verified: false },
      });
    }

    // Create new
    return await prisma.userPhoneNumber.create({
      data: {
        userId,
        phoneNumber,
        verified: false,
      },
    });
  }

  async sendVerificationCode(userId: string, phoneNumber: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await client.messages.create({
        body: `Your SOLEINTEL verification code is: ${code}. Valid for 10 minutes.`,
        from: fromNumber,
        to: phoneNumber,
      });

      // Store verification code
      await prisma.smsVerification.create({
        data: {
          userId,
          phoneNumber,
          code,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      return code; // In production, don't return this
    } catch (error) {
      throw new Error(`Failed to send verification: ${(error as Error).message}`);
    }
  }

  async verifyPhoneNumber(userId: string, code: string) {
    const verification = await prisma.smsVerification.findFirst({
      where: {
        userId,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      throw new Error('Invalid or expired verification code');
    }

    // Mark phone as verified
    await prisma.userPhoneNumber.update({
      where: { userId },
      data: { verified: true },
    });

    // Clean up verification codes
    await prisma.smsVerification.deleteMany({
      where: { userId },
    });

    return { success: true, message: 'Phone number verified' };
  }

  async getUserPhoneNumber(userId: string) {
    return await prisma.userPhoneNumber.findUnique({
      where: { userId },
    });
  }

  async enableSMSAlerts(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { smsAlertsEnabled: true },
    });
  }

  async disableSMSAlerts(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { smsAlertsEnabled: false },
    });
  }

  async getSMSNotificationHistory(userId: string, limit: number = 20) {
    return await prisma.smsNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export function getSMSService() {
  return new SMSService();
}
