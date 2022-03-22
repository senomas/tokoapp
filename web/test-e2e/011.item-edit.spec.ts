import {test, expect} from '@playwright/test';
import {enhance} from './lib';

test('011.item-edit', async ({browser}) => {
  const context = await browser.newContext({
    recordVideo: {dir: '/app/videos/'}
  });
  try {
    const page = await context.newPage();
    const {screenshot} = enhance('item-edit', page);

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
    const itemRow = items.locator('tbody tr:visible').nth(0);

    await expect(items.locator('tfoot')).toContainText('1 - 10 of 227');
    const paging = items.locator('tfoot div.page');
    for (let i = 0; i < 10; i++) {
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveText(String(i + 1));
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveClass(
        `page ${i === 0 ? 'link-' : 'link'}`
      );
    }

    await expect(itemRow.locator('td:visible').nth(0)).toHaveText('1');
    await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
      'Tas » Totebag'
    );
    await expect(itemRow.locator('td:visible').nth(2)).toHaveText(
      'Totebag Starbucks S'
    );
    await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');

    // detail
    await itemRow.click();
    await page.waitForTimeout(500);
    await screenshot('view.png');

    await expect(page.locator('.veil .header')).toHaveText('Edit Item');

    const editName = page.locator('.veil .body input#name');
    const editCategory = page.locator('.veil .body input#category_id');
    const editDescription = page.locator('.veil .body input#description');

    await expect(editName).toHaveValue('Totebag Starbucks S');
    await expect(editCategory).toHaveValue('Tas » Totebag');
    await expect(editDescription).toHaveValue('');

    // edit values
    await editName.fill('Totebag Starbucks S NEW');
    await editCategory.click();
    await screenshot('edit-category.png');
    await expect(page.locator('.veil .body div.options .option')).toHaveCount(
      5
    );
    await expect(
      page.locator('.veil .body div.options .option').nth(3)
    ).toHaveText('Botol Minum » Tumbler');
    await editCategory.fill('botol');
    await screenshot('edit-category-2.png');
    await expect(page.locator('.veil .body div.options .option')).toHaveCount(
      3
    );
    await expect(
      page.locator('.veil .body div.options .option').nth(1)
    ).toHaveText('Botol Minum » Tumbler');
    await page.locator('.veil .body div.options .option').nth(1).click();
    await editDescription.fill('This is the new item');
    await screenshot('edit.png');
    await page.locator('.veil .footer button#save').click();
    await screenshot('new-item.png');

    await expect(itemRow.locator('td:visible').nth(0)).toHaveText('1');
    await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
      'Botol Minum » Tumbler'
    );
    await expect(itemRow.locator('td:visible').nth(2)).toHaveText(
      'Totebag Starbucks S NEW'
    );
    await expect(itemRow.locator('td:visible').nth(3)).toHaveText(
      'This is the new item'
    );

    // rollback edit
    await itemRow.click();
    await page.waitForTimeout(500);
    await screenshot('rollback-view.png');

    // edit values
    await editName.fill('Totebag Starbucks S');
    await editCategory.click();
    await expect(page.locator('.veil .body div.options .option')).toHaveCount(
      5
    );
    await expect(
      page.locator('.veil .body div.options .option').nth(1)
    ).toHaveText('Tas » Totebag');
    await page.locator('.veil .body div.options .option').nth(1).click();
    await editDescription.fill('');
    await screenshot('rollback-edit.png');
    await page.locator('.veil .footer button#save').click();
    await screenshot('rollback.png');

    await expect(items.locator('tfoot')).toContainText('1 - 10 of 227');
    for (let i = 0; i < 10; i++) {
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveText(String(i + 1));
      await expect(paging.nth(i), `paging ${i + 1}`).toHaveClass(
        `page ${i === 0 ? 'link-' : 'link'}`
      );
    }

    await expect(itemRow.locator('td:visible').nth(0)).toHaveText('1');
    await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
      'Tas » Totebag'
    );
    await expect(itemRow.locator('td:visible').nth(2)).toHaveText(
      'Totebag Starbucks S'
    );
    await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');

    await page.waitForTimeout(1000);
  } finally {
    await context.close();
  }
});
