import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage';

    test.describe('Authorization suite', () => {
        
        let loginPage: LoginPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await page.goto('https://www.saucedemo.com');
    });

    test('Success login', async () => {
        await loginPage.authorize('standard_user', 'secret_sauce')
    })

    test('Unhappy path: unsuccessful authorization', async () => {
        await loginPage.authorize('test', 'test')

        await test.step('Verify error is displayed', async () => {
        const isErrorDisplayed = await loginPage.isErrorDisplayed();
        expect(isErrorDisplayed).toBeTruthy();
        })

        await test.step('Verify error message', async () => {
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
        })

        await test.step('Verify is on login page', async () => {
        const isOnLoginPage = await loginPage.isOnLoginPage();
        expect(isOnLoginPage).toBeTruthy();
        })
    })

    // Invalid credentials: wrong username and correct password
    // Invalid credentials: wrong password and correct username
    // Invalid credentials: fields are empty
    // Validate that user can close error message


})