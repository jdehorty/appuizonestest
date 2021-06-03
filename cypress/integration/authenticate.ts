/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { config } from 'dotenv';
import { Browser, launch, Page } from 'puppeteer';

console.log('===== Beginning Puppeteer Script =====');

config();
const imsEmail = "designinsightuser01@bentleyconnectops.bentley.com";
const imsPassword = "fuYumfJQ8CNzEemn";
const imsUrl = "https://dev-connect-mllabelingtool.bentley.com/24b566ed-a308-49b3-8831-8f4f3b0d17a5/82eccd21-bb76-414a-b82a-04913509d5d1";

interface TokenObject {
    imsToken: string | undefined;
    aspNetCookies: string | undefined;
}

(async (): Promise<TokenObject> => {
    const browser: Browser = await launch({
        headless: true,
        ignoreHTTPSErrors: true,
        timeout: 60000,
    });

    try {
        if (!(imsEmail && imsPassword && imsUrl)) {
            return {} as TokenObject;
        }

        const page: Page = await browser.newPage();
        await page.goto(imsUrl);
        await page.type('#EmailAddress', imsEmail);
        await page.type('#Password', imsPassword);
        const btn = await page.waitForSelector('#submitLogon');
        await btn?.click();

        // DEV and QA Only
        await page.waitForSelector('input[name="loginfmt"]');
        await page.type('input[name="loginfmt"]', imsEmail);
        const msBtn = await page.waitForSelector('#idSIButton9');
        await msBtn?.click();
        await page.waitForSelector('#passwordInput');
        await page.type('#passwordInput', imsPassword);
        const submit = await page.waitForSelector('#submitButton');
        await submit?.click();
        const rememberBtn = await page.waitForSelector('#idBtn_Back');
        await rememberBtn?.click();


        const token: string = await page.$eval(
            'pre',
            (pre: Element): string => (pre as HTMLElement).innerText
        );
        const cookies = await page.cookies();
        const aspNetCookie = cookies.find(c => c.name === '.AspNetCore.Cookies');
        const aspNetCookieValue = aspNetCookie?.value;

        await browser.close();
        console.log('===== Ending Puppeteer Script =====');

        return {
            aspNetCookies: aspNetCookieValue,
            imsToken: token.replace(/^"|"$/g, ''),
        };
    } catch (error) {
        await browser.close();
        throw error;
    }
})()
    .then(() => 'Cookies successfully retrieved')
    .catch(err => console.log(err));


describe('Authenticate with puppeteer', () => {
    console.log('===== Beginning Puppeteer Script =====');

});