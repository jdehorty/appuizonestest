import * as dotenv from 'dotenv';
import getLocalStorage from '../utils/getToken';
require('es6-promise').polyfill();
require('isomorphic-fetch');

dotenv.config();

interface Created {
  on: any;
  config: {
    env: {
      configFile: string;
      baseUrl: any;
      imsUser: string | undefined;
      imsPass: string | undefined;
      bentleyEnv: string | undefined; cookies: string
    };
    baseUrl: any
  };
}

export default async ({on, config}: Created) => {
  console.log('===== Cypress.io: Running Plugin file =====');

  let configFile = process.env.TEST_ENV;
  const imsUser = process.env.IMS_USER;
  const imsPass = process.env.IMS_PASS;

  if (!configFile) configFile = config.env.configFile || 'local';

  const configJson = require(`../config/${configFile?.trim()}.json`);
  const { cookies } = await getLocalStorage();

  config.baseUrl = configJson.env.baseUrl;
  config.env.baseUrl = configJson.env.baseUrl;
  config.env.imsUser = imsUser;
  config.env.imsPass = imsPass;
  config.env.bentleyEnv = configFile?.trim();
  config.env.cookies = cookies;

  return config;
};
