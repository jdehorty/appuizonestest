interface Window {
  microsoftTeams: any;
}

describe('Projects Selection', () => {
  const environment =
    Cypress.env('bentleyEnv') === 'local' ? 'qa' : Cypress.env('bentleyEnv');

  beforeEach(() => {
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
          url: '**HeaderFooter/GetServiceList**',
          response: json,
        });
      })
      .as('getServices');

    cy.route('/WebService/GetURL?**').as('urls');
    cy.route('/connect/userinfo').as('userinfo');
  });

  it('lets users know if no projects exist', () => {
    const context = {
      groupId: '32e1242341',
      locale: 'something',
      teamId: 'jd89389',
    };
    cy.on('window:before:load', win => {
      win.microsoftTeams.getContext = callback => {
        callback(context);
      };
    });
    cy.fixture(`emptyProjects`)
      .then(json => {
        cy.route({
          method: 'GET',
          url: `**/CONNECTEDContext/Project?rbacOnly=true`,
          response: json,
        });
      })
      .as('getProjects');

    cy.fixture(`emptyProjects`)
      .then(json => {
        cy.route({
          method: 'GET',
          url: `**/CONNECTEDContext/Project?isFavorite=true`,
          response: json,
        });
      })
      .as('getFavoriteProjects');

    cy.fixture('emptyProjects')
      .then(json => {
        cy.route({
          method: 'GET',
          url: `**/CONNECTEDContext/Project?isMRU=true`,
          response: json,
        });
      })
      .as('getMRUProjects');

    cy.visitWithAuth('/team-tab-config');
    cy.wait(['@getProjects', '@getFavoriteProjects', '@urls']);

    cy.contains('Favorites').click();
    cy.contains('No projects found');
    cy.get('Button').should('not.exist');
  });

  it('loads projects', () => {
    // favorites
    const context = {
      groupId: '32e1242341',
      locale: 'something',
      teamId: 'asdjklasdjkl',
    };
    cy.on('window:before:load', win => {
      win.microsoftTeams.getContext = callback => {
        callback(context);
      };
    });

    cy.visitWithAuth('/team-tab-config');
    cy.wait(['@getProjects', '@urls']);

    cy.contains('My Projects').click();
    cy.get('ul').children('li').should('have.length', 6);

    cy.contains('Recent').click();

    cy.get('ul').children('li').should('have.length', 1);

    cy.contains('Favorites').click();

    cy.get('ul').children('li').should('have.length', 2);
  });

  // fold into above test
  it('selects items by id', async () => {
    cy.visitWithAuth('/team-tab-config');
    cy.wait(['@getProjects', '@urls']);
    cy.get('ul').children('li').should('have.length', 6);
    cy.contains('Same Name Project').click();
    cy.get("ul li:contains('Same Name Project')").should('have.length', 2);

    cy.get("ul li:contains('Same Name Project')")
      .first()
      .then(firstLi => {
        cy.get("ul li:contains('Same Name Project')")
          .last()
          .should('not.have.class', firstLi.attr('class'));
      });
  });

  describe('Project Persistence', () => {
    it('does not select an initial project if not returned from /groups path', () => {
      const context = {
        groupId: '32e1242341',
        locale: 'something',
        teamId: 'asmkldiajsod',
      };
      cy.on('window:before:load', win => {
        win.microsoftTeams.getContext = callback => {
          callback(context);
        };
      });

      cy.route({
        method: 'GET',
        url: '**/api/Groups/asmkldiajsod',
        response: JSON.stringify({
          projectId: '',
        }),
      }).as('fetchGroup');

      cy.visitWithAuth('/team-tab-config');
      cy.wait(['@urls', '@getProjects']);
      cy.get('button.forward').should('have.attr', 'disabled');
    });

    it('displays the service screen if a projectId is returned from /groups path', () => {
      const context = {
        groupId: '32e1242341',
        locale: 'something',
        teamId: '2389423',
      };
      cy.on('window:before:load', win => {
        win.microsoftTeams.getContext = callback => {
          callback(context);
        };
      });

      cy.route({
        method: 'GET',
        url: '**/api/Groups/2389423',
        response: JSON.stringify({
          projectId: 'eb1a3839-3697-445e-a0a4-5c07788b0f47',
        }),
      }).as('fetchGroup');

      cy.visitWithAuth('/team-tab-config');
      cy.wait(['@urls', '@fetchGroup', '@getProjects']);
      cy.contains('Select Service');
    });

    it('displays the persisted project as default on the services step if selected', () => {
      const context = {
        groupId: '32e1242341',
        locale: 'something',
        teamId: 'h89d2d',
      };
      cy.on('window:before:load', win => {
        win.microsoftTeams.getContext = callback => {
          callback(context);
        };
      });

      cy.route({
        method: 'GET',
        url: '**/api/Groups/h89d2d',
        response: JSON.stringify({
          projectId: 'eb1a3839-3697-445e-a0a4-5c07788b0f47',
        }),
      }).as('fetchGroup');

      cy.visitWithAuth('/team-tab-config');
      cy.wait(['@urls', '@fetchGroup', '@getProjects']);
      cy.contains('Select Service');
      cy.contains(`Using this team's default project: 1F89CD90 - APV-AB10`);
    });

    it("if a project selected differs from returned by /groups, identifies the project is different from the team's default ", () => {
      const context = {
        groupId: '32e1242341',
        locale: 'something',
        teamId: '8329eu9823dj',
      };
      cy.on('window:before:load', win => {
        win.microsoftTeams.getContext = callback => {
          callback(context);
        };
      });

      cy.route({
        method: 'GET',
        url: '**/api/Groups/8329eu9823dj',
        response: JSON.stringify({
          projectId: 'eb1a3839-3697-445e-a0a4-5c07788b0f47',
        }),
      }).as('fetchGroup');

      cy.visitWithAuth('/team-tab-config');
      cy.wait(['@urls', '@fetchGroup', '@getProjects']);
      cy.contains('button', 'Project').click();
      cy.contains('4th chamber project').click();
      cy.contains('Service').click();
      cy.contains(
        'New default project for this team: jd89023jd - 4th chamber project'
      );
    });

    it("if 'set as default' is not toggled, the service step identifies the project as a new tab", () => {
      const context = {
        groupId: '32e1242341',
        locale: 'something',
        teamId: 'j89ds328ds',
      };
      cy.on('window:before:load', win => {
        win.microsoftTeams.getContext = callback => {
          callback(context);
        };
      });

      cy.route({
        method: 'GET',
        url: '**/api/Groups/j89ds328ds',
        response: JSON.stringify({
          projectId: '',
        }),
      }).as('fetchGroup');

      cy.visitWithAuth('/team-tab-config');
      cy.wait(['@urls', '@getProjects']);
      cy.contains('4th chamber project').click();
      cy.contains('Service').click();
      cy.contains('Project for this tab only: jd89023jd - 4th chamber project');
    });

    it('if set as default is not toggled but the project is default - lets the user know', () => {
      const context = {
        groupId: '32e1242341',
        locale: 'something',
        teamId: 'j89ds328ds',
      };
      cy.on('window:before:load', win => {
        win.microsoftTeams.getContext = callback => {
          callback(context);
        };
      });

      cy.route({
        method: 'GET',
        url: '**/api/Groups/j89ds328ds',
        response: JSON.stringify({
          projectId: 'eb1a3839-3697-445e-a0a4-5c07788b0f47',
        }),
      }).as('fetchGroup');

      cy.visitWithAuth('/team-tab-config');
      cy.wait(['@urls', '@fetchGroup', '@getProjects']);
      cy.contains('button', 'Project').click();
      cy.contains('Set project as default for team').click();
      cy.contains('Service').click();

      cy.contains(`Using this team's default project: 1F89CD90 - APV-AB10`);
    });
  });

  describe('Project Caching', () => {
    it.skip('updates the project list if projecsts are updated', () => {
      const context = {
        groupId: '32e1242341',
        locale: 'something',
        teamId: 'j89ds328ds',
      };
      cy.on('window:before:load', win => {
        win.microsoftTeams.getContext = callback => {
          callback(context);
        };
      });
      cy.visitWithAuth('/team-tab-config');
      cy.wait(['@urls', '@getProjects']);

      cy.contains('My Projects').click();
      cy.contains('Third Project').click();

      cy.contains('Service').click();
      cy.fixture(`projects-updated.qa.json`)
        .then(json => {
          cy.route({
            method: 'GET',
            url: `**/CONNECTEDContext/Project?rbacOnly=true`,
            response: json,
          });
        })
        .as('getProjects');
      cy.contains('button', 'Project').click();
      cy.contains('Your project list has changed.');
    });
  });
});
