import { FastifyInstance } from 'fastify';
import { getAuthService, RegisterSchema, LoginSchema } from '../services/authService';

const authService = getAuthService();

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/auth/register', async (request, reply) => {
    const { email, password, name } = RegisterSchema.parse(request.body);
    const user = await authService.register(email, password, name);
    return { success: true, user };
  });

  app.post('/api/auth/login', async (request, reply) => {
    const { email, password } = LoginSchema.parse(request.body);
    const result = await authService.login(email, password);
    return { success: true, ...result };
  });

  app.post('/api/auth/login-extension', async (request, reply) => {
    const { extensionToken } = request.body as { extensionToken: string };
    if (!extensionToken) {
      throw new Error('Extension token required');
    }
    const result = await authService.loginWithExtensionToken(extensionToken);
    return { success: true, ...result };
  });

  app.get('/api/auth/me', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = auth.slice(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    return { success: true, userId: decoded.userId, email: decoded.email };
  });

  app.post('/api/auth/refresh', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = auth.slice(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const newToken = authService.generateToken(decoded.userId, decoded.email);
    return { success: true, token: newToken };
  });

  app.patch('/api/auth/profile', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = auth.slice(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const { name, email } = request.body as { name?: string; email?: string };
    const user = await authService.updateProfile(decoded.userId, { name, email });

    return { success: true, user };
  });

  app.post('/api/auth/change-password', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = auth.slice(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const { oldPassword, newPassword } = request.body as {
      oldPassword: string;
      newPassword: string;
    };
    await authService.changePassword(decoded.userId, oldPassword, newPassword);

    return { success: true, message: 'Password changed successfully' };
  });

  app.post('/api/auth/regenerate-extension-token', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = auth.slice(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const user = await authService.regenerateExtensionToken(decoded.userId);
    return {
      success: true,
      extensionToken: user.extensionToken,
      message: 'Extension token regenerated',
    };
  });
}
