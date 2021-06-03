const cypress = require('cypress');
const config = require('dotenv').config;

config();

const requiredEnvVars = ['OIDC_EMAIL', 'OIDC_PASS', 'BASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `Ensure you've added a ${envVar} variable in your environment configuration using DOTENV or other means`
    );
  }
}

const testEnv = process.env.TEST_ENV ? process.env.TEST_ENV : 'local';

cypress
  .run({
    headless: true,
    config: {
      env: {
        configFile: testEnv,
      },
      chromeWebSecurity: false,
      integrationFolder: '.',
    },
    spec: '.\\cypress\\operational\\operational_spec.ts',
  })
  .then(() => {
    console.log('Cypress All Done');
  })
  .catch(err => {
    console.error(err);
  });
