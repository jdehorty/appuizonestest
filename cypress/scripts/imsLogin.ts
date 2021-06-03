import { config } from 'dotenv';
import { Browser, launch, Page } from 'puppeteer';

console.log('===== Beginning Puppeteer Script =====');

config();
const imsEmail: string = process.env.IMS_USER!;
const imsPassword: string = process.env.IMS_PASS!;

(async (): Promise<any> => {
  const password = imsPassword;

  const browser: Browser = await launch({
    headless: true,
    ignoreHTTPSErrors: true,
    timeout: 60000,
  });

  try {
    const page: Page = await browser.newPage();
    await page.goto(
      'https://ims.bentley.com/IMS/Account/Login?ReturnUrl=%2f%3fwa%3dwsignin1.0%26wtrealm%3dhttps%253a%252f%252fprojectshareportal.bentley.com%252f'
    );
    await page.type('#EmailAddress', imsEmail);
    await page.type('#Password', password);
    const btn = await page.waitForSelector('#submitLogon');
    await btn?.click();

    await page.waitForSelector("input[name='UserName']");
    await page.type("input[name='UserName']", imsEmail);
    await page.type("input[name='Password']", imsPassword);
    const bentleyBtn = await page.waitForSelector('span#submitButton');
    await bentleyBtn?.click();

    const cookies = await page.cookies();

    return cookies.map(c => ({
      [c.name]: c.value,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
})()
  .then(() => 'Cookies successfully retrieved')
  .catch(err => console.log(err));
