import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';


test.describe('Shopping cart tests', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;


    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);

        await page.goto('https://www.saucedemo.com');
        await loginPage.authorize('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
    })

    test('Add one item to the cart', async ({ page }) => {
        // await inventoryPage.addProductToCart('Sauce Labs Onesie');

        // await inventoryPage.addProductToCartSimple('Sauce Labs Onesie');
        // await inventoryPage.clickCart();

        const item = await inventoryPage.findItemByName('Sauce Labs Onesie');
        await item?.addToCart();
        expect(item?.name).toBe('Sauce Labs Onesie');
        const itemCountAdded = await inventoryPage.getCartItemCount();
        console.log(itemCountAdded);

    })

    // Create test add three items and verify that there are three items added
    // expect(itemCountAdded).....

    test('Add three items to the cart', async ({}) => {
        const itemsToAdd = [
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Backpack'
        ];

        for (const name of itemsToAdd) {
            const item = await inventoryPage.findItemByName(name);
            expect(item).toBeDefined();
            await item!.addToCart();
        }

        const itemCountAdded = await inventoryPage.getCartItemCount();
        expect(itemCountAdded).toBe('3');
    })

    test('Item removal functionality', async ({}) => {
        const onesie = await inventoryPage.findItemByName('Sauce Labs Onesie');
        await onesie?.addToCart();

        const backpack = await inventoryPage.findItemByName('Sauce Labs Backpack');
        await backpack?.addToCart();

        const itemCountAdded = await inventoryPage.getCartItemCount();
        expect(itemCountAdded).toBe('2');

        await inventoryPage.removeProduct('Sauce Labs Onesie');
        const itemCountAfterDeletion = await inventoryPage.getCartItemCount();
        expect(itemCountAfterDeletion).toBe('1');
    })
    

    

})