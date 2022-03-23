import {test, expect, Page} from '@playwright/test';
import {close, init, screenshot} from './lib';

let page: Page;

test.beforeAll(async ({browser}) => {
  page = await init(browser, 'login');
});

test.afterAll(async () => {
  await close();
});

test('000.login', async () => {
  await page.goto('http://nginx:8000/', {waitUntil: 'networkidle'});
  const title = page.locator('.veil .header');
  await expect(title).toHaveText('Login');
  await expect(await screenshot('index.png')).toMatchSnapshot();

  await page.fill('text=Email', 'admin@tokoapp.com');
  await page.fill('text=Password', 'dodol123');
  await page.waitForTimeout(500);
  await expect(await screenshot('login-fill.png')).toMatchSnapshot();

  await page.locator('button >> text=login').click();
  await page.waitForLoadState('networkidle');
  await page.locator('header >> text=TokoApp').waitFor();
  await expect(await screenshot('login.png')).toMatchSnapshot();
});
