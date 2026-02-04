import { test, expect } from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:8080')
})

test('Wait for element appears after 2 seconds', async ({page}) => {
    const showButton = page.locator('#show-delayed');
    const delayedElement = page.locator('#delayed-element');

    // Check that element is hidden before click
    await expect(delayedElement).toBeHidden(); 

    // Click showButton;
    await showButton.click();

    // Playwright will automatically wait for element
    await expect(delayedElement).toBeVisible();

    await expect(delayedElement).toContainText('I appeared! Check me with toBeVisible()');
})

test('Wait for element to dissapear', async ({page}) => {
    await page.click('#show-delayed');
    await expect(page.locator('#delayed-element')).toBeVisible();

    // Hide element
    await page.locator('#hide-element').click()
    await expect(page.locator('#delayed-element')).toBeHidden();

    await expect(page.locator('#result-basic')).toContainText('Element hidden');
})

test('Check that element was removed from DOM', async ({page}) => {
    await page.click('#show-delayed');

   await expect(page.locator('#delayed-element')).toBeVisible();

    await page.click('#remove-element')

    // Verify that element is not existing in DOM anymore;
    await page.locator('#delayed-element').waitFor({state: 'detached'})
    // attached - element present in DOM
    // detached - element deleted from DOM
    // visible - element is visible
    // hidden - element is hidden or even deleted;

    //toHaveCount(0)

})

test('Wait for text is changed', async ({page}) => {
        const textContainer = page.locator('#text-container');

       // Verify initial state
       await expect(textContainer).toHaveText('Original text');

       // Click on button
       await page.click('#change-text');

       // Verify middle state
       await expect(textContainer).toHaveText('Changing text...');

       // Final state verification
       await expect(textContainer).toHaveText('New text after delay');


       const partialTextContainer = page.locator('#partial-text');

       await expect(partialTextContainer).toContainText('KEY')
       await expect(partialTextContainer).not.toContainText('YOLO');

       await page.click('#random-text');
       await page.click('#random-text');
       await expect(textContainer).toHaveText(/special|number|text/);

})

test('Verify form values', async ({page}) => {

    const nameInput = page.locator('#name-input');
    const emailInput = page.locator('#email-input');
    const phoneInput = page.locator('#phone-input');

    await expect(nameInput).toHaveValue('');
    await expect(emailInput).toHaveValue('');
    await expect(phoneInput).toHaveValue('+1 (555) 123-4567');

    // Fill the fields:
    await nameInput.fill('Nikita Milka')
    await emailInput.fill('nikita@milka.me')

    await expect(nameInput).toHaveValue('Nikita Milka');

    const submitButton = page.locator('#submit-form');

    await expect(submitButton).toBeDisabled();

    await page.click('#enable-submit');

    await expect(submitButton).toBeEnabled();

    await expect(submitButton).toContainText('Active');
})

test('verify css properties', async ({page}) => {
    const attributeBox = page.locator('#attribute-box');

    await expect(attributeBox).toHaveAttribute('data-status', 'pending');
    await expect(attributeBox).toHaveAttribute('data-count', '0');

    await page.click('#change-attribute')
    await expect(attributeBox).toHaveAttribute('data-status', 'active');
    await expect(attributeBox).toHaveAttribute('data-count', '1');

    await page.click('#change-attribute')
    await expect(attributeBox).toHaveAttribute('data-count', '2');



})



