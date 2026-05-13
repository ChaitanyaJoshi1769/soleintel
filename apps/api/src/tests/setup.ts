/**
 * Test Setup & Global Configuration
 */

import prisma from '../config/database';

// Setup: Run before all tests
beforeAll(async () => {
  // Ensure database is connected
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Test database connected');
  } catch (error) {
    console.error('✗ Failed to connect to test database');
    throw error;
  }
});

// Teardown: Run after all tests
afterAll(async () => {
  await prisma.$disconnect();
  console.log('✓ Test database disconnected');
});

// Timeout for all tests
jest.setTimeout(30000);

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning') || args[0].includes('Deprecation'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
