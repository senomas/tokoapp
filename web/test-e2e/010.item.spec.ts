import {test, expect, Page} from '@playwright/test';
import {close, init, screenshot} from './lib';

let page: Page;

test.beforeAll(async ({browser}) => {
  page = await init(browser, 'item');
});

test.afterAll(async () => {
  await close();
});

test('011.item.login', async () => {
  await page.goto('http://nginx:8000/', {waitUntil: 'networkidle'});
  await expect(await screenshot('index.png')).toMatchSnapshot();
  await expect(page.locator('.veil .header')).toHaveText('Login');

  await page.fill('text=Email', 'admin@tokoapp.com');
  await page.fill('text=Password', 'dodol123');
  await page.waitForTimeout(500);
  await expect(await screenshot('login-fill.png')).toMatchSnapshot();

  await page.locator('button >> text=login').click();
  await page.waitForLoadState('networkidle');
  await page.locator('header >> text=TokoApp').waitFor();
  await expect(await screenshot('login.png')).toMatchSnapshot();
});

test('010.item.list', async () => {
  await page.locator('nav#sidebar').hover();
  await expect(await screenshot('sidebar.png')).toMatchSnapshot();

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

  const itemRow3rd = items.locator('tbody tr:visible').nth(2);
  await expect(itemRow3rd.locator('td:visible').nth(0)).toHaveText('3');
  await expect(itemRow3rd.locator('td:visible').nth(1)).toHaveText(
    'Botol Minum » Tumbler'
  );
  await expect(itemRow3rd.locator('td:visible').nth(2)).toHaveText(
    'Tumbler Starbucks 3000ml Kaca'
  );
  await expect(itemRow3rd.locator('td:visible').nth(3)).toHaveText('');
});

test('010.item.list.2ndPage', async () => {
  const items = page.locator('table#items');
  const paging = items.locator('tfoot div.page');
  const itemRow3rd = items.locator('tbody tr:visible').nth(2);

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
  await expect(itemRow3rd.locator('td:visible').nth(2)).toHaveText('Botol 10');
  await expect(itemRow3rd.locator('td:visible').nth(3)).toHaveText('');
});

test('010.item.list.filterByCategory', async () => {
  const items = page.locator('table#items');
  const paging = items.locator('tfoot div.page');

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
});

test('010.item.list.filterNoData', async () => {
  const items = page.locator('table#items');

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
});

test('010.item.list.resetFilter', async () => {
  const items = page.locator('table#items');
  const paging = items.locator('tfoot div.page');

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
});

test('010.item.list.orderByIdDesc', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

  await items.locator('thead:visible td >> text=ID').click();
  await page.waitForLoadState('networkidle');
  await screenshot('order-by-id.png');

  // TODO check order icons

  await expect(itemRow.locator('td:visible').nth(0)).toHaveText('227');
  await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
    'Tas » Totebag'
  );
  await expect(itemRow.locator('td:visible').nth(2)).toHaveText('Totebag 100');
  await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');
});

test('010.item.list.orderByCategory', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

  await items.locator('thead:visible td >> text=Category').click();
  await page.waitForLoadState('networkidle');
  await screenshot('order-by-category.png');

  // TODO check order icons

  await expect(itemRow.locator('td:visible').nth(0)).toHaveText('4');
  await expect(itemRow.locator('td:visible').nth(1)).toHaveText('Botol Minum');
  await expect(itemRow.locator('td:visible').nth(2)).toHaveText('Botol 1');
  await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');
});

test('010.item.list.orderByCategoryDesc', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

  await items.locator('thead:visible td >> text=Category').click();
  await page.waitForLoadState('networkidle');
  await screenshot('order-by-category-desc.png');

  // TODO check order icons

  await expect(itemRow.locator('td:visible').nth(0)).toHaveText('227');
  await expect(itemRow.locator('td:visible').nth(1)).toHaveText(
    'Tas » Totebag'
  );
  await expect(itemRow.locator('td:visible').nth(2)).toHaveText('Totebag 100');
  await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');
});

test('010.item.list.orderByName', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

  await items.locator('thead:visible td >> text=Name').click();
  await page.waitForLoadState('networkidle');
  await screenshot('order-by-name.png');

  // TODO check order icons

  await expect(itemRow.locator('td:visible').nth(0)).toHaveText('4');
  await expect(itemRow.locator('td:visible').nth(1)).toHaveText('Botol Minum');
  await expect(itemRow.locator('td:visible').nth(2)).toHaveText('Botol 1');
  await expect(itemRow.locator('td:visible').nth(3)).toHaveText('');
});

test('010.item.list.orderByNameDesc', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

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
});

test('010.item.list.orderByiD', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

  await items.locator('thead:visible td >> text=ID').click();
  await page.waitForLoadState('networkidle');

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
});

test('010.item-view-detail', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

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
});

test('010.item-edit', async () => {
  const editName = page.locator('.veil .body input#name');
  const editCategory = page.locator('.veil .body input#category_id');
  const editDescription = page.locator('.veil .body input#description');

  await editName.fill('Totebag Starbucks S NEW');
  await editCategory.click();
  await screenshot('edit-category.png');
  await expect(page.locator('.veil .body div.options .option')).toHaveCount(5);
  await expect(
    page.locator('.veil .body div.options .option').nth(3)
  ).toHaveText('Botol Minum » Tumbler');
  await editCategory.fill('botol');
  await screenshot('edit-category-2.png');
  await expect(page.locator('.veil .body div.options .option')).toHaveCount(3);
  await expect(
    page.locator('.veil .body div.options .option').nth(1)
  ).toHaveText('Botol Minum » Tumbler');
  await page.locator('.veil .body div.options .option').nth(1).click();
  await editDescription.fill('This is the new item');
  await screenshot('edit.png');
  await page.locator('.veil .footer button#save').click();
  await screenshot('new-item.png');
});

test('010.item-edit-list', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

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
});

test('010.item-edit-rollback', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);

  const editName = page.locator('.veil .body input#name');
  const editCategory = page.locator('.veil .body input#category_id');
  const editDescription = page.locator('.veil .body input#description');

  await itemRow.click();
  await page.waitForTimeout(500);
  await screenshot('rollback-view.png');

  await editName.fill('Totebag Starbucks S');
  await editCategory.click();
  await expect(page.locator('.veil .body div.options .option')).toHaveCount(5);
  await expect(
    page.locator('.veil .body div.options .option').nth(1)
  ).toHaveText('Tas » Totebag');
  await page.locator('.veil .body div.options .option').nth(1).click();
  await editDescription.fill('');
  await screenshot('rollback-edit.png');
  await page.locator('.veil .footer button#save').click();
  await screenshot('rollback.png');
});

test('010.item-edit-rollback-list', async () => {
  const items = page.locator('table#items');
  const itemRow = items.locator('tbody tr:visible').nth(0);
  const paging = items.locator('tfoot div.page');

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
});
