interface Window {
  microsoftTeams: any;
}

describe('Connections Selection', () => {
  const environment =
    Cypress.env('bentleyEnv') === 'local' ? 'qa' : Cypress.env('bentleyEnv');

  beforeEach(() => {
    // Login redirects to config based on whether or not
    // an entityId exists in the context
    cy.on('window:before:load', win => {
      const context = {
        entityId: undefined,
        locale: 'something',
        groupId: '34879248792',
        teamId: '089u23d90832jd',
      };

      win.microsoftTeams.getContext = callback => {
        callback(context);
      };

      win.microsoftTeams.getTabInstances = (
        callback: (tabInfo) => void,
        params?
      ) => callback({ teamTabs: [] });
    });

    if (environment !== 'production') {
      cy.server();
      cy.route({
        method: 'GET',
        url: '**/api/auth/test',
        response: 200,
        status: 200,
      }).as('testAuth');

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

      cy.route({
        method: 'GET',
        url: '**/api/Groups/**',
        response: JSON.stringify({
          projectId: '',
        }),
      }).as('fetchProjectFromGroup');

      cy.fixture('servicesRegistry.json')
        .then(json => {
          cy.route({
            method: 'GET',
            url: '**/api/v1/Services/enabled?localize=false',
            response: json,
          });
        })
        .as('getServices');

      cy.fixture('launchDarklyFlags.json').then(json => {
        cy.route({
          method: 'GET',
          url: 'https://app.launchdarkly.com/sdk/evalx/**',
          response: json,
        });
      });

      cy.route({
        method: 'PUT',
        url: '**/v1.0/Application/3060/Context/**',
        response: JSON.stringify({}),
      }).as('updateSettingsService');

      cy.route({
        method: 'GET',
        url: '**/v1.0/Application/3060/Context/**',
        response: JSON.stringify([
          {
            id: '45148e22-3331-402d-9b75-553371167e6c',
            name: 'f8a8c7fecc1ad920aa1d4d907439a1e7c07fcbaa',
            namespace: 'datasources',
            contexts: {
              org: '72adad30-c07c-465d-a1fe-2f2dfac950a4',
              application: '3060',
              context: 'd0b47722-aee4-4c4d-8a32-9449f64ed039',
            },
            properties: {
              Id: 'f8a8c7fecc1ad920aa1d4d907439a1e7c07fcbaa',
              Url:
                'https://dev-pw-saas.eastus.cloudapp.azure.com/ws/v2.8/repositories/Bentley.PW--dev-pw-saas.eastus.cloudapp.azure.com~3AProjectWise~20SaaS/PW_WSG/Project/616fa8a3-5ade-4baf-a4a4-69a8c1f6e96e',
              Name: 'My Connection',
              Description:
                'dev-pw-saas.eastus.cloudapp.azure.com:ProjectWise SaaS',
              Type: 'Bentley.PW',
              UIUrl: null,
              WorkAreaName: 'ben.polinsky',
              DefaultTab:
                'https://teams.microsoft.com/l/entity/6d45a192-7d23-425a-b832-9281747d209e/JTdCJTIycHJvamVjdElkJTIyJTNBJTIyZDBiNDc3MjItYWVlNC00YzRkLThhMzItOTQ0OWY2NGVkMDM5JTIyJTJDJTIycHJvamVjdE5hbWUlMjIlM0ElMjJCTFQlMjIlMkMlMjJwcm9qZWN0TnVtYmVyJTIyJTNBJTIyQkxUJTIyJTJDJTIyc2VydmljZUlkJTIyJTNBJTIyMzdjZWUxZTQtNmUzZC00ZjliLWJjZGMtZjEwZTY2ZDU2MTA0JTIyJTJDJTIyY29ubmVjdGlvbk5hbWUlMjIlM0ElMjJNeSUyMENvbm5lY3Rpb24lMjIlMkMlMjJjb25uZWN0aW9uSWQlMjIlM0ElMjJmOGE4YzdmZWNjMWFkOTIwYWExZDRkOTA3NDM5YTFlN2MwN2ZjYmFhJTIyJTJDJTIyZW1iZWRVcmwlMjIlM0ElMjJodHRwcyUyNTNBJTI1MkYlMjUyRnFhLWNvbm5lY3QtcHJvamVjdHdpc2V3YWMuYmVudGxleS5jb20lMjUyRiUyNTJGY29udGV4dCUyNTJGZDBiNDc3MjItYWVlNC00YzRkLThhMzItOTQ0OWY2NGVkMDM5JTI1MkZjb25uZWN0aW9uJTI1MkZmOGE4YzdmZWNjMWFkOTIwYWExZDRkOTA3NDM5YTFlN2MwN2ZjYmFhJTI1M0ZhdXRoLXZpYS1wb3B1cCUyNTNEdHJ1ZSUyMiUyQyUyMmxpbmtUb1VybCUyMiUzQSUyMmh0dHBzJTI1M0ElMjUyRiUyNTJGcWEtY29ubmVjdC1wcm9qZWN0d2lzZXdhYy5iZW50bGV5LmNvbSUyNTJGJTI1MkZjb250ZXh0JTI1MkZkMGI0NzcyMi1hZWU0LTRjNGQtOGEzMi05NDQ5ZjY0ZWQwMzklMjUyRmNvbm5lY3Rpb24lMjUyRmY4YThjN2ZlY2MxYWQ5MjBhYTFkNGQ5MDc0MzlhMWU3YzA3ZmNiYWElMjIlMkMlMjJzZXJ2aWNlTmFtZSUyMiUzQSUyMlByb2plY3RXaXNlJTIwV2ViJTIwQ29ubmVjdGlvbnMlMjIlN0Q%3D?context=%7B%22channelId%22%3A%2219%3Ab86bfce37e814d7c91e7ce8d932d682b%40thread.skype%22%7D',
            },
          },
        ]),
      }).as('getConnections');
    }

    cy.visitWithAuth('/team-tab-config');
  });

  it.skip('requires a user to select a connection if the PW WAC service is selected', () => {
    cy.wait([
      '@getMRUProjects',
      '@getFavoriteProjects',
      '@getProjects',
      '@fetchProjectFromGroup',
    ]);

    cy.contains('Favorites').click();
    cy.contains('A Favorite Project').click();

    cy.contains('Service').click();
    cy.wait('@getServices');
    cy.contains('ProjectWise Web Connections').click();
    cy.contains(/^Tab Name/).should('not.exist');
    cy.contains(/^Connection/).click();
    cy.wait('@getConnections');
    cy.contains('My Connection');
    cy.get('@setValidityState').should('not.be.calledWith', true);

    cy.contains('Service').click();

    cy.contains('button.back span', 'Project').click();
    cy.contains('My Projects');

    cy.contains('Favorites').click();
    cy.contains('A Favorite Project').click();

    cy.contains('Service').click();
    cy.contains('ProjectWise Web Connections').click();

    cy.contains(/^Connection/).click();
    cy.contains('My Connection').click();
    cy.contains('Tab Name').click();
    cy.get('@setValidityState').should('be.calledWith', true);
  });

  it('does not allow a user to select a connection if the WAC flag is on and PW Share service is selected', () => {
    cy.wait([
      '@getMRUProjects',
      '@getFavoriteProjects',
      '@getProjects',
      '@fetchProjectFromGroup',
    ]);
    cy.contains('Favorites').click();
    cy.contains('A Favorite Project').click();

    cy.contains('Service').click();
    cy.contains('Share').click();
    cy.contains(/^Connection/).should('not.exist');
    cy.contains(/^Tab Name/).click();
  });

  it.skip('calls the product settings service if a connection is set as default for this tab', () => {
    cy.wait([
      '@getMRUProjects',
      '@getFavoriteProjects',
      '@getProjects',
      '@fetchProjectFromGroup',
    ]);
    cy.contains('Favorites').click();
    cy.contains('A Favorite Project').click();

    cy.contains('Service').click();
    cy.contains('ProjectWise Web Connections').click();
    cy.contains(/^Tab Name/).should('not.exist');
    cy.contains(/^Connection/).click();
    cy.contains('My Connection').click();
    cy.contains('Set created tab as default for connection').click();
    cy.wait(1000);
    cy.contains('Tab Name').click();
    cy.window().then(win => {
      win.microsoftTeams.settings.onSaveHandler();
    });
    cy.wait('@updateSettingsService');
  });
});
