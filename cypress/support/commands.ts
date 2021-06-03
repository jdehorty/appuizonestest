import {
  authFrame,
  authNonFrame,
  setCookies,
  visitWithAuth,
  visitWithAuthMockWindow,
} from './commands/authentication';

Cypress.Commands.add('visitWithAuth', visitWithAuth);
Cypress.Commands.add('visitWithAuthMockWindow', visitWithAuthMockWindow);
Cypress.Commands.add('authFrame', authFrame);
Cypress.Commands.add('authNonFrame', authNonFrame);
Cypress.Commands.add('setCookies', setCookies);
