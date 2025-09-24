import { test, expect } from '@playwright/test';

test.describe('Smart Resume Editor', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('Smart Resume Editor');
    
    // Check if the description is visible
    await expect(page.locator('p')).toContainText('Real-time resume editing during job applications');
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Smart Resume Editor/);
  });
});