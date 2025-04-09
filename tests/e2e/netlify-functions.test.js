// tests/e2e/netlify-functions.test.js
import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for Netlify functions
 * These tests verify that the Netlify functions are working correctly
 * and that the UI components that interact with them are functioning properly
 */

// Test the hello-world function directly
test('hello-world function returns correct response', async ({ request }) => {
  const response = await request.get('/.netlify/functions/hello-world');
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data).toHaveProperty('message');
  expect(data.message).toContain('Hello from Bully Hub');
  expect(data).toHaveProperty('timestamp');
});

// Test the color prediction function
test('color-prediction function returns correct response', async ({ request }) => {
  const response = await request.post('/.netlify/functions/color-prediction', {
    data: {
      sireId: 'test-sire-id',
      damId: 'test-dam-id'
    }
  });
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  
  // Verify the structure of the response
  expect(data).toHaveProperty('possibleColors');
  expect(Array.isArray(data.possibleColors)).toBeTruthy();
});

// Test the COI calculator function
test('coi-calculator function returns correct response', async ({ request }) => {
  const response = await request.post('/.netlify/functions/coi-calculator', {
    data: {
      sireId: 'test-sire-id',
      damId: 'test-dam-id',
      generations: 5
    }
  });
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  
  // Verify the structure of the response
  expect(data).toHaveProperty('coi');
  expect(typeof data.coi).toBe('number');
});

// Test the UI integration with the color prediction function
test('color prediction UI works correctly', async ({ page }) => {
  // Navigate to the breeding compatibility page
  await page.goto('/dashboard/breeding/compatibility');
  
  // Fill in the form
  await page.selectOption('select[name="sire"]', 'test-sire-id');
  await page.selectOption('select[name="dam"]', 'test-dam-id');
  
  // Click the calculate button
  await page.click('button:has-text("Calculate")');
  
  // Wait for the results to load
  await page.waitForSelector('.results-container');
  
  // Verify that the results are displayed
  const resultsText = await page.textContent('.results-container');
  expect(resultsText).toContain('Possible Colors');
});

// Test the monitoring dashboard
test('monitoring dashboard loads correctly', async ({ page }) => {
  // Navigate to the monitoring dashboard
  await page.goto('/dashboard/monitoring');
  
  // Wait for the dashboard to load
  await page.waitForSelector('h1:has-text("Netlify Functions Monitoring")');
  
  // Verify that the function metrics are displayed
  await page.waitForSelector('table');
  
  // Check that the table has rows for each function
  const functionRows = await page.$$('table tbody tr');
  expect(functionRows.length).toBeGreaterThan(0);
  
  // Check that the charts are displayed
  await page.waitForSelector('.recharts-responsive-container');
});

// Test the Edge Function for color prediction
test('color prediction Edge Function returns cached results', async ({ request }) => {
  // Make the first request to populate the cache
  const response1 = await request.post('/api/color-prediction', {
    data: {
      sireId: 'test-sire-id',
      damId: 'test-dam-id'
    }
  });
  
  expect(response1.ok()).toBeTruthy();
  
  // Check the cache header
  expect(response1.headers()['x-cache']).toBe('MISS');
  
  // Make a second request with the same parameters
  const response2 = await request.post('/api/color-prediction', {
    data: {
      sireId: 'test-sire-id',
      damId: 'test-dam-id'
    }
  });
  
  expect(response2.ok()).toBeTruthy();
  
  // Check that the second request was served from cache
  expect(response2.headers()['x-cache']).toBe('HIT');
});
