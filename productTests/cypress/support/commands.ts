declare namespace Cypress {
  interface Chainable<Subject> {
    checkRow(
        rowName: string,
        timeout?: number
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    checkSecondaryGridRow(
        rowName: string,
        timeout?: number
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    isRowSelected(rowName: string, timeout?: number): boolean;
    pressEscape(): Cypress.Chainable<JQuery<HTMLBodyElement>>;
    waitSpinner(): Cypress.Chainable<JQuery<HTMLElement>>;
    waitBwcSpinner(): Cypress.Chainable<JQuery<HTMLElement>>;
    waitToast(message: string): Cypress.Chainable<JQuery<HTMLElement>>;
    waitCurrentBreadcrumbToBe(
        folderName: string
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    navigateToFolder(
        folderName: string
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    waitItemOnTable(itemName: string): Cypress.Chainable<JQuery<HTMLElement>>;
    waitTableNotContain(
        itemName: string
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    getByTestId(itemName: string): Cypress.Chainable<JQuery<HTMLElement>>;
    waitToastToDissapear(
        message: string
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    clickMore(): Cypress.Chainable<JQuery<HTMLElement>>;
    doesHaveBadge(
        fileName: string,
        iconName?: string
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    doesNotHaveBadge(
        fileName: string,
        iconName: string
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    performContextMenuAction(
        itemName: string,
        buttonId: string
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    shouldBeDisabledByTestId(
        testId: string
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    unCheckRow(
        rowName: string,
        timeout?: number
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    openInformationPanel(
        fileNames: string[]
    ): Cypress.Chainable<JQuery<HTMLElement>>;
  }
}

function checkRow(
    rowName: string,
    timeout?: number
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .contains('span', rowName, { timeout: timeout || 3000 })
      .closest('[role="row"]')
      .within(() => {
        return cy.get('input[type="checkbox"]').then(elem => {
          var checkbox = elem as JQuery<HTMLInputElement>;
          if (checkbox.length && !checkbox[0].checked) {
            return cy.get('input[type="checkbox"]').click({ force: true });
          } else {
            return elem;
          }
        });
      });
}

function checkSecondaryGridRow(
    rowName: string,
    timeout?: number
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .contains('div', rowName, { timeout: timeout || 3000 })
      .closest('[role="row"]')
      .within(() => {
        return cy.get('input[type="checkbox"]').then(elem => {
          var checkbox = elem as JQuery<HTMLInputElement>;
          if (checkbox.length && !checkbox[0].checked) {
            return cy.get('input[type="checkbox"]').click({ force: true });
          } else {
            return elem;
          }
        });
      });
}

function unCheckRow(
    rowName: string,
    timeout?: number
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .contains('span', rowName, { timeout: timeout || 3000 })
      .closest('[role="row"]')
      .within(() => {
        return cy.get('input[type="checkbox"]').then(elem => {
          var checkbox = elem as JQuery<HTMLInputElement>;
          if (checkbox.length && checkbox[0].checked) {
            return cy.get('input[type="checkbox"]').click({ force: true });
          } else {
            return elem;
          }
        });
      });
}
function doesHaveBadge(
    fileName: string,
    iconName: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .contains('span', fileName)
      .closest('[role="row"]')
      .within(() => {
        return cy.get('.bwc-icons-small').then(() => {
          return cy.get('#' + iconName + '').should('exist');
        });
      });
}
function doesNotHaveBadge(
    fileName: string,
    iconName: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .contains('span', fileName)
      .closest('.cell-style')
      .within(() => {
        return cy.get('#' + iconName + '').should('not.exist');
      });
}

function isRowSelected(
    rowName: string,
    timeout?: number
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .contains('span', rowName, { timeout: timeout || 3000 })
      .closest('[role="row"]')
      .within(() => {
        return cy.get('input[type="checkbox"]').then(elem => {
          var checkbox = elem as JQuery<HTMLInputElement>;
          return checkbox.length && checkbox[0].checked;
        });
      });
}

function pressEscape(): Cypress.Chainable<JQuery<HTMLBodyElement>> {
  return cy.get('body').trigger('keydown', { keyCode: 27 });
}
function waitSpinner(): Cypress.Chainable<JQuery<HTMLElement>> {
  cy.get('.share-loader').should('be.visible');
  return cy.get('.share-loader').should('not.be.visible');
}

function waitBwcSpinner(): Cypress.Chainable<JQuery<HTMLElement>> {
  cy.get('.bwc-progress-spinner').should('be.visible');
  return cy.get('.bwc-progress-spinner').should('not.be.visible');
}

function waitToast(message: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('.message').should('contain', message);
}

function waitToastToDissapear(
    message: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('.message', { timeout: 10000 }).should('not.contain', message);
}

function waitCurrentBreadcrumbToBe(
    folderName: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('.current').should('contain', folderName);
}

function navigateToFolder(
    folderName: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .contains('span', folderName)
      .closest('.itemLink')
      .click({ force: true });
}

function waitItemOnTable(
    itemName: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('.cell-style').should('contain', itemName);
}

function waitTableNotContain(
    itemName: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('.cell-style').should('not.contain', itemName);
}

function getByTestId(itemName: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('[data-testid=' + itemName + ']').should('not.be.disabled');
}
function shouldBeDisabledByTestId(
    testId: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('[data-testid=' + testId + ']').should('be.disabled');
}
function clickMore(): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .get(
          '.tooltip-content > .tooltip > .bwc-menu-item > .bwc-menu-item-content > .bwc-menu-item-svg > svg'
      )
      .first()
      .click();
}
function performContextMenuAction(
    itemName: string,
    buttonId: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
      .contains('span', itemName)
      .closest('[role="row"]')
      .within(() => {
        cy.get('.context-menu-icon').click({ force: true });
      })
      .then(() => {
        cy.getByTestId('dropdown-list').within(() => {
          cy.getByTestId(buttonId).click({ force: true });
        });
      });
}
function openInformationPanel(
    fileNames: string[]
): Cypress.Chainable<JQuery<HTMLElement>> {
  fileNames.forEach(fileName => {
    cy.checkRow(fileName);
  });

  return cy.getByTestId('InformationPanel').click();
}
Cypress.Commands.add('checkRow', checkRow);
Cypress.Commands.add('isRowSelected', isRowSelected);
Cypress.Commands.add('pressEscape', pressEscape);
Cypress.Commands.add('waitSpinner', waitSpinner);
Cypress.Commands.add('waitToast', waitToast);
Cypress.Commands.add('waitToastToDissapear', waitToastToDissapear);
Cypress.Commands.add('navigateToFolder', navigateToFolder);
Cypress.Commands.add('waitItemOnTable', waitItemOnTable);
Cypress.Commands.add('waitTableNotContain', waitTableNotContain);
Cypress.Commands.add('getByTestId', getByTestId);
Cypress.Commands.add('waitCurrentBreadcrumbToBe', waitCurrentBreadcrumbToBe);
Cypress.Commands.add('clickMore', clickMore);
Cypress.Commands.add('doesHaveBadge', doesHaveBadge);
Cypress.Commands.add('doesNotHaveBadge', doesNotHaveBadge);
Cypress.Commands.add('performContextMenuAction', performContextMenuAction);
Cypress.Commands.add('shouldBeDisabledByTestId', shouldBeDisabledByTestId);
Cypress.Commands.add('unCheckRow', unCheckRow);
Cypress.Commands.add('openInformationPanel', openInformationPanel);
