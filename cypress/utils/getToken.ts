import { config } from 'dotenv';
import { Browser, launch, Page } from 'puppeteer';

console.log('===== Beginning Puppeteer Script =====');

config();

const testEnv = process.env.TEST_ENV;
const oidcEmail = process.env.IMS_USER;
const oidcPass = process.env.IMS_PASS;

export default async (): Promise<{
  cookies: string;
}> => {
  const browser: Browser = await launch({
    headless: true,
    ignoreHTTPSErrors: true,
  });

  try {
    let authUrl, shareUrl, dmUrl, insightsUrl;

    switch (testEnv) {
      case 'local':
        authUrl =
          'https://projectwiseteamshost.bentley.com:44313/Home/authorize';
        shareUrl =
          'https://qa-projectshareportal.bentley.com/#/2067ac31-2923-4f27-b36a-1c62de106911';
        dmUrl =
          'https://qa-connect-btsportal.bentley.com/48aceb3a-6bfa-44f6-830c-e6b5b248092a/Projects/48aceb3a-6bfa-44f6-830c-e6b5b248092a/PackageList#incoming';
        insightsUrl =
          'https://qa-projectinsights.bentley.com/PBI.Frontend/en-US/0560ab37-cde3-4583-8fd8-f582aca05fd8';
        break;
      case 'dev':
        authUrl =
          'https://dev-connect-projectwiseteamshost.bentley.com/Home/authorize';
        shareUrl =
          'https://dev-projectshareportal.bentley.com/#/170e9e2f-c4df-4560-a1ab-c8ab5606bdeb';
        dmUrl =
          'https://dev-connect-btsportal.bentley.com/c2e4c2dd-ef6a-4206-96d3-3a4c5537b8c9/Projects/c2e4c2dd-ef6a-4206-96d3-3a4c5537b8c9/PackageList#incoming';

        insightsUrl =
          'https://dev-projectinsights.bentley.com/PBI.Frontend/en-US/170e9e2f-c4df-4560-a1ab-c8ab5606bdeb/';
        break;
      case 'qa':
        authUrl =
          'https://qa-connect-projectwiseteamshost.bentley.com/Home/authorize';
        shareUrl =
          'https://qa-projectshareportal.bentley.com/#/2067ac31-2923-4f27-b36a-1c62de106911';
        dmUrl =
          'https://qa-connect-btsportal.bentley.com/2067ac31-2923-4f27-b36a-1c62de106911/Projects/2067ac31-2923-4f27-b36a-1c62de106911/PackageList#incoming';

        insightsUrl =
          'https://qa-projectinsights.bentley.com/PBI.Frontend/en-US/0560ab37-cde3-4583-8fd8-f582aca05fd8';
        break;
      default:
        authUrl =
          'https://connect-projectwiseteamshost.bentley.com/Home/authorize';
        break;
    }

    const pages: Page[] = await browser.pages();
    let page: Page = pages[0];

    console.log('===== Signing In To PWTMH  =====');

    page = await signIn(page, authUrl);

    await page.waitFor(3000); // seems to be necessary...

    // PWTMH Cookies
    const cookies = await page.cookies();
    const stringifiedCookies = JSON.stringify(cookies);

    await browser.close();

    console.log('===== Done Grabbing Cookies before E2E =====');

    return {
      cookies: stringifiedCookies,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const signIn = async (page: Page, url) => {
  const bentleyEmailField: string = 'input#identifierInput';
  const bentleyPasswordField: string = '#password';
  const pingButton: string = 'div#postButton a';
  const passwordSubmitButton = 'a[title="Sign In "]';
  const managePermissionSubmit = '//button[contains(text(), "Allow")]';

  try {
    if (!(testEnv && oidcEmail && oidcPass)) {
      throw new Error('Login credentials were not provided');
    }

    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    try {
      await page.waitForSelector(bentleyEmailField);
    } catch (error) {
      console.log('Timed out');
      console.log('Error', error);
      return await TrySignInIMS1(page, url);
    }

    await page.type(bentleyEmailField, oidcEmail);

    await (await page.waitForSelector(pingButton))?.click();

    const passwordField = await page.waitForSelector(bentleyPasswordField);

    await page.type(bentleyPasswordField, oidcPass);
    await page.focus(bentleyPasswordField);
    await passwordField?.click();
    await (await page.waitForSelector(passwordSubmitButton))?.click();

    await page.waitForNavigation();

    await page.waitFor(5000);

    const permissionBtn = await page.$x(managePermissionSubmit);
    if (permissionBtn && permissionBtn.length) {
      await permissionBtn[0].click();
      await page.waitForNavigation();
      await page.waitFor(5000);
    }

    return page;
  } catch (error) {
    console.log('Error signing in...');
    console.log(error);
    throw error;
  }
};

const TrySignInIMS1 = async (page: Page, url): Promise<Page> => {
  console.log(`\n------- SIGN IN IMS1.0 -------`);

  const bentleyEmailField: string = 'input[name="EmailAddress"]';
  const bentleyPasswordField: string = '#Password';
  const bentleySubmit: string = '#submitLogon';

  try {
    const response = await page.goto(url, { waitUntil: 'load', timeout: 0 });

    if (!(testEnv && oidcEmail && oidcPass)) {
      throw new Error('Login credentials were not provided');
    }

    await page.waitForSelector(bentleyEmailField);
    console.log(`\n------- OIDC EMAIL BEING USED FOR AUTH IS: ${oidcEmail}`);
    await page.type(bentleyEmailField, oidcEmail);

    const passwordField = await page.waitForSelector(bentleyPasswordField);

    await page.type(bentleyPasswordField, oidcPass);
    await page.focus(bentleyPasswordField);
    await passwordField?.click();
    await (await page.waitForSelector(bentleySubmit))?.click();

    await page.waitForNavigation();

    return page;
  } catch (error) {
    console.log('Error signing in...');
    console.log(error);
    throw error;
  }
};
