import {test, expect} from '@playwright/test';
import {enhance} from './lib';

test('010.item-list', async ({browser}) => {
  const context = await browser.newContext({
    recordVideo: {dir: '/app/videos/'}
  });
  try {
    const page = await context.newPage();
    const {screenshot} = enhance('item', page);

    await page.goto('http://nginx:8000/', {waitUntil: 'networkidle'});
    await screenshot('index.png');
    await expect(page.locator('.veil .header')).toHaveText('Login');

    await page.fill('text=Email', 'admin@tokoapp.com');
    await page.fill('text=Password', 'dodol123');
    await page.waitForTimeout(500);
    await screenshot('login-fill.png');

    await page.locator('button >> text=login').click();
    await page.waitForLoadState('networkidle');
    await page.locator('header >> text=TokoApp').waitFor();
    await screenshot('login.png');

    await page.locator('nav#sidebar').hover();
    await screenshot('sidebar.png');

    await page.locator('nav >> text=Item').click();
    await page.waitForLoadState('networkidle');
    await screenshot();

    await page.mouse.move(500, 500);
    await page.waitForTimeout(500);
    await screenshot('page-1.png');

    const items = page.locator('table#items');
    await expect(items.locator('tfoot')).toContainText('1 - 10 of 227');
    const paging = items.locator('tfoot div.page');
    for (let i = 0; i < 10; i++) {
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveText(String(i + 1));
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveClass(
        `page ${i === 0 ? 'link-' : 'link'}`
      );
    }

    const itemRow = items.locator('tbody tr:visible').nth(0);
    const itemRow3rd = items.locator('tbody tr:visible').nth(2);
    await expect(itemRow3rd.locator('td:visible').nth(0)).toHaveText('3');
    await expect(itemRow3rd.locator('td:visible').nth(1)).toHaveText(
      'Botol Minum » Tumbler'
    );
    await expect(itemRow3rd.locator('td:visible').nth(2)).toHaveText(
      'Tumbler Starbucks 3000ml Kaca'
    );
    await expect(itemRow3rd.locator('td:visible').nth(3)).toHaveText('');

    // goto to 2nd page
    await expect(items.locator('tfoot div.page').nth(1)).toHaveText('2');
    await items.locator('tfoot div.page').nth(1).click();
    await page.waitForLoadState('networkidle');
    await screenshot('page-2.png');

    await expect(items.locator('tfoot')).toContainText('11 - 20 of 227');
    for (let i = 0; i < 10; i++) {
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveText(String(i + 1));
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveClass(
        `page ${i === 1 ? 'link-' : 'link'}`
      );
    }

    await expect(itemRow3rd.locator('td:visible').nth(0)).toHaveText('13');
    await expect(itemRow3rd.locator('td:visible').nth(1)).toHaveText(
      'Botol Minum'
    );
    await expect(itemRow3rd.locator('td:visible').nth(2)).toHaveText(
      'Botol 10'
    );
    await expect(itemRow3rd.locator('td:visible').nth(3)).toHaveText('');

    // filter by category
    await items.locator('tfoot div#filter').click();
    await page.waitForLoadState('networkidle');
    await screenshot('filter.png');

    await expect(page.locator('.veil .header')).toHaveText('Filter');
    await page.fill('.veil .body >> text=Category', 'tas');
    await screenshot('filter-fill.png');
    await page.locator('.veil .footer button >> text=Apply').click();
    await page.waitForLoadState('networkidle');
    await screenshot('filter-apply.png');

    await expect(items.locator('tfoot')).toContainText('1 - 10 of 170');
    for (let i = 0; i < 10; i++) {
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveText(String(i + 1));
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveClass(
        `page ${i === 0 ? 'link-' : 'link'}`
      );
    }

    // filter no-data
    await items.locator('tfoot div#filter').click();
    await page.waitForLoadState('networkidle');
    await screenshot('filter.png');

    await expect(page.locator('.veil .header')).toHaveText('Filter');
    await page.fill('.veil .body >> text=Category', 'NO_DATA');
    await screenshot('filter-fill.png');
    await page.locator('.veil .footer button >> text=Apply').click();
    await page.waitForLoadState('networkidle');
    await screenshot('filter-no-data.png');

    await expect(items.locator('tfoot')).toContainText('No data');

    // reset filter
    await items.locator('tfoot div#filter').click();
    await page.waitForLoadState('networkidle');
    await screenshot('filter.png');

    await expect(page.locator('.veil .header')).toHaveText('Filter');
    await page.locator('.veil .footer button >> text=Reset').click();
    await page.waitForLoadState('networkidle');
    await screenshot('filter-reset.png');

    await expect(items.locator('tfoot')).toContainText('1 - 10 of 227');
    for (let i = 0; i < 10; i++) {
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveText(String(i + 1));
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveClass(
        `page ${i === 0 ? 'link-' : 'link'}`
      );
    }

    // test order by ID
    await items.locator('thead:visible td >> text=ID').click();
    await page.waitForLoadState('networkidle');
    await screenshot('order-by-id.png');

    // TODO check order icons

    await expect(itemRow.locator('td:visible').nth(0)).toHaveText('227');
    await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
      'Tas » Totebag'
    );
    await expect(itemRow.locator('td:visible').nth(2)).toHaveText(
      'Totebag 100'
    );
    await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');

    // test order by category
    await items.locator('thead:visible td >> text=Category').click();
    await page.waitForLoadState('networkidle');
    await screenshot('order-by-category.png');

    // TODO check order icons

    await expect(itemRow.locator('td:visible').nth(0)).toHaveText('11');
    await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
      'Botol Minum'
    );
    await expect(itemRow.locator('td:visible').nth(2)).toHaveText('Botol 8');
    await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');

    // test order by category desc
    await items.locator('thead:visible td >> text=Category').click();
    await page.waitForLoadState('networkidle');
    await screenshot('order-by-category-desc.png');

    // TODO check order icons

    await expect(itemRow.locator('td:visible').nth(0)).toHaveText('148');
    await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
      'Tas » Totebag'
    );
    await expect(itemRow.locator('td:visible').nth(2)).toHaveText('Totebag 5');
    await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');

    // test order by name
    await items.locator('thead:visible td >> text=Name').click();
    await page.waitForLoadState('networkidle');
    await screenshot('order-by-name.png');

    // TODO check order icons

    await expect(itemRow.locator('td:visible').nth(0)).toHaveText('4');
    await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
      'Botol Minum'
    );
    await expect(itemRow.locator('td:visible').nth(2)).toHaveText('Botol 1');
    await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');

    // test order by name desc
    await items.locator('thead:visible td >> text=Name').click();
    await page.waitForLoadState('networkidle');
    await screenshot('order-by-name-desc.png');

    // TODO check order icons

    await expect(itemRow.locator('td:visible').nth(0)).toHaveText('3');
    await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
      'Botol Minum » Tumbler'
    );
    await expect(itemRow.locator('td:visible').nth(2)).toHaveText(
      'Tumbler Starbucks 3000ml Kaca'
    );
    await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');

    await page.waitForTimeout(1000);
  } finally {
    await context.close();
  }
});
