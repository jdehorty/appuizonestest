const webpack = require('@cypress/webpack-preprocessor');
const puppeteer = require('puppeteer');

module.exports = async (on, config) => {
    const options = {
        webpackOptions: require('../webpack.cypress.config'),
    };

    on('file:preprocessor', webpack(options));

    // It would be nice to get the bearer token using the bearerToken.ts class on the
    // window:before:load event, but 1) we can't open puppeteer from inside the cypress context
    // (here is still outside the cypress context), and 2) I can't figure out how to call into the
    // bearerToken.ts class from this file without breaking things. So most of the functions below
    // are copies from the bearerToken.ts class.
    // console.log(config);
    const oidcStorageToken = await getBearerToken(
        config.baseUrl,
        config.env.userName,
        config.env.userPassword,
        config
    );

    config.oidcStorageToken = oidcStorageToken;
    config.accessToken = JSON.parse(oidcStorageToken).access_token;
    return config;
};

// There is no way to get an OAuth token via API
// Currently, IMS blocks rendering the login form inside a frame like Cypress uses to run the tests
// In order to log in, we launch another headless driver (Puppeteer) and log in with the form,
// grab the correct key from local storage which has the Bearer token, and insert that key into
// the Cypress browser on 'window:before:load'
async function getBearerToken(url, userName, password, config) {
    console.log('Launching puppeteer...');
    let {browser, page} = await initPuppeteerBrowser(config);
    page = await signIn(page, url, userName, password);

    const oidcStorageToken = await page.evaluate(getOidcTokenFromLocalStorage);
    await browser.close();

    if (!oidcStorageToken) {
        console.log('Unable to get auth token');
        throw new Error('Unable to get auth token');
    }

    return oidcStorageToken;
}

// async function initPuppeteerBrowser(config) {
//     const browser = await puppeteer.launch({
//         headless: true,
//         ignoreHTTPSErrors: true
//     });
//
//     const pages = await browser.pages();
//     const page = pages[0];
//     return {
//         browser,
//         page,
//     };
// }

async function signIn(page, url, userName, password) {
    const bentleyEmailField = 'input[name="EmailAddress"]';
    const bentleyPasswordField = '#Password';
    const bentleySubmit = '#submitLogon';

    console.log(`Visiting ${url}...`);
    await page.goto(url, {
        waitUntil: 'load',
        timeout: 60000,
    });

    await page.waitForSelector(bentleyEmailField, {
        timeout: 60000,
    });
    await page.type(bentleyEmailField, userName);

    const passwordField = await page.waitForSelector(bentleyPasswordField);
    await page.type(bentleyPasswordField, password);
    await page.focus(bentleyPasswordField);
    await passwordField.click();

    console.log('Submitting login info...');
    await (await page.waitForSelector(bentleySubmit)).click();

    await page.waitForNavigation();
    await page.waitFor(2000);

    return page;
}

function getOidcTokenFromLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.indexOf('oidc.user') > -1) {
            return localStorage.getItem(key) || '';
        }
    }
    return '';
}
