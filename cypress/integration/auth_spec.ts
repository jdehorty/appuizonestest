describe('Authentication', () => {
  beforeEach(() => {
    const environment =
      Cypress.env('bentleyEnv') === 'local' ? 'qa' : Cypress.env('bentleyEnv');
    if (environment !== 'production') {
      cy.server();

      cy.fixture(`projects.${environment}.json`)
        .then(json => {
          cy.route({
            method: 'GET',
            url: `**/Repositories/BentleyCONNECT--Main/CONNECTEDContext/Project*`,
            response: json,
          });
        })
        .as('getProjects');

      cy.route({
        method: 'GET',
        url: '/api/auth/urls',
        response: JSON.stringify({
          connectApiUrl: 'something',
        }),
      });

      cy.route({
        url:
          '**/something/v2.5/Repositories/BentleyCONNECT--Main/CONNECTEDContext/Project*',
        method: 'GET',
        response: JSON.stringify({}),
      });
    }
  });

  it('cannot access /team-tab-config no token is set', () => {
    // Login redirects to config based on whether or not
    // an entityId exists in the context
    cy.on('window:before:load', win => {
      const context = {
        entityId: undefined,
        locale: 'something',
      };

      win.microsoftTeams.getContext = callback => {
        callback(context);
      };
    });
    cy.visit('/team-tab-config');

    cy.contains('Sign in');
  });

  it('can access private routes if token is set', () => {
    cy.on('window:before:load', win => {
      const context = {
        entityId: 'must-be-defined',
        groupId: '32e1242341',
        locale: 'something',
      };

      win.microsoftTeams.getContext = callback => {
        callback(context);
      };
    });

    cy.visitWithAuth('/team-tab-config');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/team-tab-config`);
    cy.get('Sign in').should('not.exist');
  });
});
