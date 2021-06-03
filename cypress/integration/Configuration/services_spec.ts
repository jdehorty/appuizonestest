interface Window {
  microsoftTeams: any;
}

let times = 0;

describe('Services Selection', () => {
  const environment =
    Cypress.env('bentleyEnv') === 'local' ? 'qa' : Cypress.env('bentleyEnv');

  beforeEach(() => {
    // Login redirects to config based on whether or not
    // an entityId exists in the context
    cy.on('window:before:load', win => {
      const context = {
        entityId: '',
        locale: 'something',
        teamId: 'sadh9832',
      };

      win.microsoftTeams.getContext = callback => {
        callback(context);
      };
      win.microsoftTeams.initialize = () => {};
    });

    cy.server();
    cy.route({
      method: 'POST',
      url: '**/Home/LogFeature',
      response: JSON.stringify({}),
    });

    cy.fixture(`projects.${environment}.json`)

      .then(json => {
        if (!json.postMessage) {
          cy.route({
            method: 'GET',
            url: `**/CONNECTEDContext/Project?rbacOnly=true`,
            response: json,
          });
        }
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
          url: '**/HeaderFooter/GetServiceList**',
          response: json,
        });
      })
      .as('getServices');

    cy.fixture(`connections.${environment}.json`)
      .then(json => {
        return cy.route({
          method: 'GET',
          url: `**/ProjectGateway/Wsg/v2.4/**`,
          response: json,
        });
      })
      .as('getConnections');
    cy.route({
      method: 'GET',
      url: '**/api/Groups/**',
      response: JSON.stringify({
        projectId: '',
      }),
    }).as('fetchProjectFromGroup');
  });

  it('displays Share and WAC as separate services if WAC flag is enabled', () => {
    cy.route({
      method: 'GET',
      url: 'https://app.launchdarkly.com/sdk/evalx/**',
      response: JSON.stringify({
        'access-field-data-management': {
          value: true,
          version: 38,
          variation: 0,
          trackEvents: false,
        },
        'access-issue-resolution': {
          value: true,
          version: 33,
          variation: 0,
          trackEvents: false,
        },
        'access-performance-dashboards': {
          value: true,
          version: 40,
          variation: 0,
          trackEvents: false,
        },
        'allow-context-share': {
          value: false,
          version: 8,
          variation: 1,
          trackEvents: false,
        },
        'pw-wac': {
          value: true,
          version: 20,
          variation: 1,
          trackEvents: false,
        },
        'track-features': {
          value: true,
          version: 15,
          variation: 0,
          trackEvents: false,
        },
        'use-service-registry': {
          value: true,
          version: 7,
          variation: 0,
          trackEvents: false,
        },
        'use-teams-data-attributes': {
          value: true,
          version: 9,
          variation: 0,
          trackEvents: false,
        },
      }),
    });

    cy.visitWithAuth('/team-tab-config');

    cy.wait([
      '@getMRUProjects',
      '@getFavoriteProjects',
      '@getProjects',
      '@fetchProjectFromGroup',
    ]);

    cy.contains('Favorites').click();

    cy.contains('A Favorite Project').click();

    cy.contains('Service').click();
    cy.contains('Share');
    cy.contains('ProjectWise Web Connections');
  });
});
