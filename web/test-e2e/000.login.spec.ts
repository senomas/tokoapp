import {test, expect} from '@playwright/test';
import {enhance} from './lib';

test('login', async ({page}) => {
  const {screenshot} = enhance('login', page);

  await page.goto('http://nginx:8000/', {waitUntil: 'networkidle'});
  await screenshot('index.png');
  const title = page.locator('.veil .header');
  await expect(title).toHaveText('Login');

  await page.fill('text=Email', 'admin@tokoapp.com');
  await page.fill('text=Password', 'dodol123');
  await page.waitForTimeout(500);
  await screenshot('login-fill.png');

  await page.locator('button >> text=login').click();
  await page.waitForLoadState('networkidle');
  await page.locator('header >> text=TokoApp').waitFor();
  await screenshot('login.png');
});
