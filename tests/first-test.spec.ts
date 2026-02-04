import { test, expect } from '@playwright/test'

test('Open Google page', async ({ page }) => {
    await page.goto('https://www.google.com');

    await expect(page).toHaveTitle(/Google/);

    await page.getByRole('button', { name: 'Piekrist visiem'}).click();
    await expect(page.getByRole('combobox', {name: 'Meklēt'})).toBeVisible();

    console.log('Test was passed!');
})