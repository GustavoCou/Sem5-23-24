describe('ListFloorsComponent', () => {
  beforeEach(() => {
    cy.visit('/floor'); // Reemplaza '/ruta-a-tu-componente' con la ruta real de tu componente
    cy.get('#ListFloor').click();

  });

  it('should display the initial state', () => {

    // Ensure that the initial state is displayed correctly
    cy.wait(2000); // Ajusta según sea necesario
    cy.get('#building-select').select('B');
    cy.get('.floor-list ul li').should('have.length', 0);

  });
 
  it('should load floors when selecting a building', () => {
    cy.get('#building-select').select('B'); 
    cy.get('.floor-list ul li').should('have.length.greaterThan', 0);
  });

  it('should handle errors when loading buildings', () => {
    cy.intercept('GET', '/api/building/list', { statusCode: 500, body: 'Internal Server Error' });
    cy.reload(); 
    cy.get('#ListFloor').click();
    cy.wait(2000)
    cy.get('.toast-error').should('be.visible');
  });



it('should navigate back correctly', () => {
  cy.get('#BackButton').click();
});
});