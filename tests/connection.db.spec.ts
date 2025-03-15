import { test } from './test';
import { expect } from '@playwright/test';

test('testing connection to in-memory database', async ({
  mongoServer,
  db,
}) => {
  expect(mongoServer.getUri()).toBe;
  expect((global as any).__TEST_CLIENT__).toBeTruthy();
  expect(db.databaseName).toBe('test');
});
