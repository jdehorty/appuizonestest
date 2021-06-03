declare namespace Cypress {
  export interface Chainable {
    visitWithAuth(
      url: string,
      service?: string,
      noCookies?: boolean
    ): Chainable<Window>;
    visitWithAuthMockWindow(url: string, propertyToMock: string);
    authFrame(env): Chainable<Window>;
    setCookies(): Chainable<Window>;
    authNonFrame(): Chainable<Window>;
  }
}
