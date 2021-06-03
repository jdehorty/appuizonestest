interface Window {
  microsoftTeams: any;
}

describe('Tab Name Configuration', () => {
  const environment =
    Cypress.env('bentleyEnv') === 'local' ? 'qa' : Cypress.env('bentleyEnv');

  beforeEach(() => {
    // Login redirects to config based on whether or not
    // an entityId exists in the context
    cy.on('window:before:load', win => {
      const context = {
        entityId: undefined,
        locale: 'something',
        teamId: '23189747894',
      };

      win.microsoftTeams.getContext = callback => {
        callback(context);
      };

      win.microsoftTeams.getTabInstances = (
        callback: (tabInfo) => void,
        params?
      ) => callback({ teamTabs: [] });
    });

    cy.server();
    cy.route({
      method: 'POST',
      url: '**/Home/LogFeature',
      response: JSON.stringify({}),
    });

    cy.fixture(`projects.${environment}.json`)
      .then(json => {
        cy.route({
          method: 'GET',
          url: `**/CONNECTEDContext/Project?rbacOnly=true`,
          response: json,
        });
      })
      .as('getProjects');

    cy.fixture('favoriteProjects')
      .then(json => {
        cy.route({
          method: 'GET',
          url: `**/CONNECTEDContext/Project?isFavorite=true`,
          response: json,
        });
      })
      .as('getFavoriteProjects');

    cy.fixture('MRUProjects')
      .then(json => {
        cy.route({
          method: 'GET',
          url: `**/CONNECTEDContext/Project?isMRU=true`,
          response: json,
        });
      })
      .as('getMRUProjects');

    cy.fixture(`servicesList.${environment}.json`)
      .then(json => {
        cy.route({
          method: 'GET',
          url: '**/api/v1/Services/enabled?localize=false',
          response: json,
        });
      })
      .as('getServices');

    cy.route({
      method: 'GET',
      url: '**/api/Groups/**',
      response: JSON.stringify({
        projectId: '',
      }),
    }).as('fetchProjectFromGroup');
    cy.fixture('servicesRegistry.json').then(json => {
      cy.route({
        method: 'GET',
        url: '**/api/v1.0/Services/enabled?localize=false',
        response: json,
      });
    });
    cy.fixture('launchDarklyFlags.json').then(json => {
      cy.route({
        method: 'GET',
        url: 'https://app.launchdarkly.com/sdk/evalx/**',
        response: json,
      });
    });
    cy.visitWithAuth('/team-tab-config');
  });

  describe('With Connection', () => {
    beforeEach(() => {
      cy.wait([
        '@getMRUProjects',
        '@getFavoriteProjects',
        '@getProjects',
        '@fetchProjectFromGroup',
      ]);

      cy.fixture(`connections.pwwac.json`)
        .then(json => {
          cy.route({
            method: 'GET',
            url: `**/api/v1/context/*/connections`,
            response: json,
          });
        })
        .as('getConnections');

      cy.contains('Favorites').click();
      cy.contains('A Favorite Project').click();

      cy.contains('Service').click();
      cy.contains('ProjectWise Web Connections').click();

      cy.contains(/^Connection/).click();
      cy.wait('@getConnections');
      cy.contains('My Connection').click();
      cy.contains('Tab Name').click();
    });

    it('correctly sets a tab name', () => {
      cy.get('input[type=text]').should('have.value', 'My Connection');

      cy.get('input[type=text]').clear();
      cy.contains('Please enter a tab name');

      cy.get('input[type=text]').clear().type('abc');
      cy.contains('Tab name must contain more than 3 characters');

      cy.get('input[type=text]').clear().type('abcd');
      cy.get('@setValidityState').should('be.calledWith', true);
    });

    it('unsets the connection name if a non-share service is set after a connection is set', () => {
      cy.contains(/^Connection/).click();
      cy.contains('Service').click();
      cy.contains('Deliverables Management').click();
      cy.contains('Tab Name').click();
      cy.get('input[type=text]').should(
        'have.value',
        'Deliverables Management'
      );
    });

    it('suggested name does not include the connection if it is the same as a service', () => {
      cy.contains(/^Connection/).click();
      cy.contains('Service').click();
      cy.contains('Share').click();
      cy.contains('Tab Name').click();
      cy.get('input[type=text]').should('have.value', 'Share');
    });
  });

  describe('With No Connection', () => {
    it('can go back and reselect a service if no connection was set', () => {
      cy.wait([
        '@getMRUProjects',
        '@getFavoriteProjects',
        '@getProjects',
        '@fetchProjectFromGroup',
      ]);

      cy.contains('Favorites').click();
      cy.contains('A Favorite Project').click();

      cy.contains('Service').click();
      cy.contains('Deliverables Management').click();
      cy.contains('Tab Name').click();
      cy.contains('Service').click();
      cy.contains('Deliverables Management').click();
      cy.contains('Tab Name').click();
      cy.get('input[type=text]').should(
        'have.value',
        'Deliverables Management'
      );
    });
  });
});
