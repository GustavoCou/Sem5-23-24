describe('List Building Component', () => {
  beforeEach(() => {
    cy.visit('/building');
    cy.get('#btnListarEdificio').click();
  });

  it('should display the list of buildings', () => {
    // Ensure that the list of buildings is displayed correctly
    cy.get('.building-list').should('exist');
    cy.get('.building-list h2').should('have.length.greaterThan', 0);
  });

  it('should display the initial state', () => {

    // Ensure that the initial state is displayed correctly
  
    cy.get('.let floor of floorList').should('have.length', 0);

  });

  it('should handle errors when loading buildings', () => {
    cy.intercept('GET', '/api/building/list', { statusCode: 500, body: 'Internal Server Error' });
    cy.reload(); 
    cy.get('#btnListarEdificio').click();
    cy.wait(2000)
    cy.get('.toast-error').should('be.visible');
  });

  it('should navigate back correctly', () => {
    // Ensure that the back button works correctly
    cy.get('.back-button').click();
   
  });


});