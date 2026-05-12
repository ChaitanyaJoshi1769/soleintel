import { FastifyInstance } from 'fastify';
import { getSMSService } from '../services/smsService';
import { z } from 'zod';

const smsService = getSMSService();

const RegisterPhoneSchema = z.object({
  phoneNumber: z.string(),
});

const VerifyCodeSchema = z.object({
  code: z.string(),
});

export async function smsRoutes(app: FastifyInstance) {
  // Register phone number for SMS alerts
  app.post('/api/sms/register', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const { phoneNumber } = RegisterPhoneSchema.parse(request.body);
    const userPhoneNumber = await smsService.registerPhoneNumber(
      (request as any).userId,
      phoneNumber,
    );

    return {
      success: true,
      message: 'Phone number registered. Check your SMS for verification code.',
      phoneNumber: userPhoneNumber.phoneNumber,
    };
  });

  // Request verification code
  app.post('/api/sms/send-verification', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const userPhone = await smsService.getUserPhoneNumber(userId);

    if (!userPhone) {
      throw new Error('Phone number not registered');
    }

    await smsService.sendVerificationCode(userId, userPhone.phoneNumber);

    return {
      success: true,
      message: 'Verification code sent. Check your SMS.',
    };
  });

  // Verify phone number with code
  app.post('/api/sms/verify', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const { code } = VerifyCodeSchema.parse(request.body);
    const result = await smsService.verifyPhoneNumber((request as any).userId, code);

    return { success: true, ...result };
  });

  // Get phone number status
  app.get('/api/sms/status', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const phoneNumber = await smsService.getUserPhoneNumber(userId);

    return {
      success: true,
      phoneNumber: phoneNumber?.phoneNumber || null,
      verified: phoneNumber?.verified || false,
    };
  });

  // Enable SMS alerts
  app.post('/api/sms/enable', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const phoneNumber = await smsService.getUserPhoneNumber(userId);

    if (!phoneNumber?.verified) {
      throw new Error('Phone number not verified');
    }

    await smsService.enableSMSAlerts(userId);

    return { success: true, message: 'SMS alerts enabled' };
  });

  // Disable SMS alerts
  app.post('/api/sms/disable', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    await smsService.disableSMSAlerts(userId);

    return { success: true, message: 'SMS alerts disabled' };
  });

  // Get notification history
  app.get('/api/sms/history', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const limit = Math.min(parseInt((request.query as any).limit || '20'), 100);
    const notifications = await smsService.getSMSNotificationHistory(userId, limit);

    return {
      success: true,
      notifications,
      count: notifications.length,
    };
  });
}
