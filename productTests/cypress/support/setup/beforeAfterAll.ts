import { initialiseTests, deleteConnectProject } from './connectProject';

var testProjectId: string;

const appendProjectToBaseUrl = (connectProjectId: string): void => {
  testProjectId = connectProjectId;
  const baseUrl = Cypress.config('baseUrl');
  Cypress.config('baseUrl', `${baseUrl}/${connectProjectId}/`);
  cy.visit('');
  cy.waitSpinner();
};

const getLocalStorageKey = () => {
  const IMSOpenID = Cypress.env('IMSOpenID');
  const oidc =
    IMSOpenID[IMSOpenID.length - 1] == '/' ? IMSOpenID.slice(0, -1) : IMSOpenID;
  return `oidc.user:${oidc}:projectwise-share-react-demo-app`;
};

before(() => {
  initialiseTests().then(appendProjectToBaseUrl);

  cy.on('window:before:load', window => {
    const config = Cypress.config() as any;
    if (config.oidcStorageToken) {
      window.localStorage.setItem(
        getLocalStorageKey(),
        config.oidcStorageToken
      );
    }
  });
});
beforeEach(() => {
  cy.on('window:before:load', window => {
    const config = Cypress.config() as any;
    if (config.oidcStorageToken) {
      window.localStorage.setItem(
        getLocalStorageKey(),
        config.oidcStorageToken
      );
    }
  });
});

after(() => {
  deleteConnectProject(testProjectId).then(() => {
    window.localStorage.removeItem(getLocalStorageKey());
  });
});
afterEach(() => {
  window.localStorage.removeItem(getLocalStorageKey());
});
