import { Cookie } from 'cookies';

export function visitWithAuth(
  url: string,
  service?: string,
  noCookies?: boolean
) {
  if (!noCookies) setCookies(service);

  cy.visit(url, {
    onBeforeLoad: win => {
      if (service) {
        const shareLocalStorage = JSON.parse(Cypress.env('shareLocalStorage'));

        for (const storageKey in shareLocalStorage) {
          win.localStorage.setItem(storageKey, shareLocalStorage[storageKey]);
        }

        const dmLocalStorage = JSON.parse(Cypress.env('dmLocalStorage'));
        for (const storageKey in dmLocalStorage) {
          win.localStorage.setItem(storageKey, dmLocalStorage[storageKey]);
        }
      }
    },
  });
}

export function visitWithAuthMockWindow(url: string, propertyToMock: any) {
  cy.visit(url, {
    onBeforeLoad: win => {
      if (!win.localStorage.getItem('imsToken')) {
        win.localStorage.setItem('imsToken', Cypress.env('imsToken'));
      }
      cy.stub(win, propertyToMock);
    },
    onLoad: win => {},
  });
}

export const setCookies = (service?: string) => {
  const cookies = JSON.parse(Cypress.env('cookies'));
  for (const cookie of cookies) {
    cy.setCookie(cookie.name, cookie.value);
  }

  if (service === 'Share') {
    const shareCookies = JSON.parse(Cypress.env('shareCookies')).filter(c =>
      c.name.startsWith('FedAuth')
    );

    for (const shareCookie of shareCookies) {
      cy.setCookie(shareCookie.name, shareCookie.value);
    }
  }

  if (service === 'DM') {
    const dmCookies = JSON.parse(Cypress.env('dmCookies')).filter(c =>
      c.name.startsWith('FedAuth')
    );

    for (const dmCookie of dmCookies) {
      cy.setCookie(dmCookie.name, dmCookie.value);
    }
  }

  if (service === 'Issues Resolution' || service === 'Field Data Management') {
    const issuesCookies: Cookie[] = JSON.parse(Cypress.env('issuesCookies'));

    for (const issuesCookie of issuesCookies) {
      try {
        cy.setCookie(issuesCookie.name, issuesCookie.value);
      } catch (error) {
        console.log(`Error setting cookies for ${service}: `, error);
      }
    }
  }

  if (service === 'Project Insights') {
    const insightsCookies: Cookie[] = JSON.parse(
      Cypress.env('projectInsightsCookies')
    );

    for (const insightsCookie of insightsCookies) {
      cy.setCookie(insightsCookie.name, insightsCookie.value);
    }
  }
};

export const authNonFrame = (env = 'development') => {
  const user = Cypress.env('imsUser');
  const password = Cypress.env('imsPass');
  if (env === 'production') {
    cy.get('input#EmailAddress').type('');
    cy.get('input#Password').type('');
    cy.get('#submitLogon').click();
    cy.get('#userNameInput').type('');
    cy.get('#passwordInput').type('');
    cy.get('#submitButton').click();
  } else {
    cy.get('input#EmailAddress').type(user);
    cy.get('input#Password').type(password);
    cy.get('#submitLogon').click();
  }
};

export const authFrame = env => {
  const user = Cypress.env('imsUser');
  const password = Cypress.env('imsPass');

  cy.log('Start Inner-Service Authentication');

  cy.get('iframe', { timeout: 60000 }).then($iframe => {
    if (cy.getCookie('ARRAffinity')) {
      cy.getCookies();
      cy.log(
        "Cookie exists - so we're logging in? how does that make any sense"
      );
    }
  });

  // Extra Dance required in production
  if (env === 'production') {
    // Apparently, we need to get the iframe again
    // I suppose if the frame changes url? Not exactly sure, but this works:
    cy.get('iframe', { timeout: 20000 }).should($iframe => {
      expect($iframe.contents().find('input#userNameInput')).to.be.visible;
      $iframe.contents().find('input#userNameInput').val(user);
      expect($iframe.contents().find('input#passwordInput')).to.be.visible;
      $iframe.contents().find('input#passwordInput').val(password);
      expect($iframe.contents().find('#submitButton')).to.be.visible;
      $iframe.contents().find('#submitButton').click();
    });
  }

  cy.log('End Inner-Service Authentication');
};
