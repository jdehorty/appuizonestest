describe('Operational Tests', () => {
  it('home page loads', () => {
    cy.visit('/');
    cy.contains('There is no root access to this application.');
  });

  it('teams script loads', () => {
    cy.request('/dist/shareTeams.min.js').its('status').should('eq', 200);
  });
});
