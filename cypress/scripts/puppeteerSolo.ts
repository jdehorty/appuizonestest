import { config } from 'dotenv';
import { Browser, launch, Page } from 'puppeteer';

console.log('===== Beginning Puppeteer Script =====');

config();
const testEnv = process.env.TEST_ENV;
const imsEmail = process.env.IMS_USER;
const imsPassword = process.env.IMS_PASS;
const imsUrl = process.env.BASE_URL;

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
    if (!(testEnv && imsEmail && imsPassword && imsUrl)) {
      return {} as TokenObject;
    }

    const page: Page = await browser.newPage();
    await page.goto(imsUrl);
    await page.type('#EmailAddress', imsEmail);
    await page.type('#Password', imsPassword);
    const btn = await page.waitForSelector('#submitLogon');
    await btn?.click();

    if (testEnv === 'production') {
      await page.waitForSelector("input[name='UserName']");
      await page.type("input[name='UserName']", imsEmail);
      await page.type("input[name='Password']", imsPassword);
      const bentleyBtn = await page.waitForSelector('span#submitButton');
      await bentleyBtn?.click();
    } else {
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
    }

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
      imsToken: token.replace(/^\"|\"$/g, ''),
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
})()
  .then(() => 'Cookies successfully retrieved')
  .catch(err => console.log(err));
