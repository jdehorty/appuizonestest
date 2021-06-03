const buddiRequest = (buddiId: string): Cypress.Chainable<any> => {
    return cy
      .request({
        method: 'GET',
        url: `https://buddi.bentley.com/WebService/GetUrl?url=${buddiId}&region=${Cypress.env(
          'buddiRegion'
        )}`,
        headers: {
          'Content-Type': 'application/json',
          // @ts-ignore
          Authorization: `Bearer ${Cypress.config('accessToken')}`,
        },
      })
      .then(response => {
        Cypress.env(buddiId, response.body.result.url);
        return response;
      });
  };
  
  const setUrlsFromBuddi = (): Cypress.Chainable<Cypress.Response> => {
    return buddiRequest('ProjectShare.Url').then(() =>
      buddiRequest('CONNECTEDContextService.URL').then(() =>
        buddiRequest('ProductSettingsService.RP').then(() =>
          buddiRequest('IMSOpenID')
        )
      )
    );
  };
  
  const uuidv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  
  const newProject = (): Object => {
    return {
      instance: {
        properties: {
          Name: uuidv4(),
          Number: uuidv4(),
          Type: '40',
          Industry: '2',
          Location: 'New Testland',
          Status: 1,
          AllowExternalTeamMembers: false,
        },
        schemaName: 'CONNECTEDContext',
        className: 'Project',
      },
    };
  };
  
  const connectProjectPost = (): Cypress.Chainable<Cypress.Response> => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env(
        'CONNECTEDContextService.URL'
      )}/v2.5/Repositories/BentleyCONNECT--Main/CONNECTEDContext/Project/`,
      body: newProject(),
      headers: {
        'Content-Type': 'application/json',
        // @ts-ignore
        Authorization: `Bearer ${Cypress.config('accessToken')}`,
      },
    });
  };
  
  const connectProjectDelete = (
    projectId: string
  ): Cypress.Chainable<Cypress.Response> => {
    return cy.request({
      method: 'DELETE',
      url: `${Cypress.env(
        'CONNECTEDContextService.URL'
      )}/sv1.0/Repositories/BentleyCONNECT--Main/CONNECTEDContext/Project/${projectId}`,
      headers: {
        'Content-Type': 'application/json',
        // @ts-ignore
        Authorization: `Bearer ${Cypress.config('accessToken')}`,
      },
    });
  };
  
  export const initialiseTests = (): Cypress.Chainable => {
    return setUrlsFromBuddi().then(() => connectProjectPost().then(
        response => response.body.changedInstance.instanceAfterChange.instanceId
        )
    );
  };
  
  export const deleteConnectProject = (
    projectId: string
  ): Cypress.Chainable<boolean> => {
    return connectProjectDelete(projectId).then(
      response => response.isOkStatusCode
    );
  };
  