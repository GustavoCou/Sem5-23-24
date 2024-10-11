// cypress/integration/list-building-min-max-floor.spec.js

describe('List Building Min and Max Floor Component', () => {
    beforeEach(() => {
      cy.visit('/building');
      cy.get('#btnListarMinMax').click();
    });

    it('should display the buildings in floor range', () => {
      cy.get('.form-container').should('exist');
      cy.get('.form-container').should('have.length.greaterThan', 0);
    });

    it('should display the inicial state', () =>  {
      cy.get('.let floor of floors').should('have.length', 0);
      cy.get('.let floorId of floor.floorIds').should('have.length', 0);
    });
  
    it('should display the form and get buildings in floor range', () => {
      // Check if the form is initially displayed
      cy.get('.form-container').should('be.visible');
    
      // Enter values into the input fields
      cy.get('#new-minFloor').clear().type('1');
      cy.get('#new-maxFloor').clear().type('2');
    
      // Click the button to get buildings in floor range
      cy.get('#list-building-min-max-floor').click();
    
      // Check if the results are displayed
      cy.get('.form-container-result').should('be.visible');
    
      // Wait for the content to load (adjust the timeout as needed)
      cy.get('.form-container-result div.paragraph-gap', { timeout: 10000 }).should('exist');
    });

    it('should display a warning when negative values are provided', () => {
      // Check if the form is initially displayed
      cy.get('.form-container').should('be.visible');
    
      // Enter negative values into the input fields
      cy.get('#new-minFloor').clear().type('-2');
      cy.get('#new-maxFloor').clear().type('2');
    
      // Click the button to get buildings in floor range
      cy.get('#list-building-min-max-floor').click();
    
      // Check if the warning toast is visible
      cy.get('.toast-warning').should('be.visible').contains('Os valores mínimo e máximo não podem ser negativos.');
      
      // Ensure that the results are not displayed
      cy.get('.form-container-result').should('not.exist');
    });

    it('should display a warning when no data is available', () => {
      // Check if the form is initially displayed
      cy.get('.form-container').should('be.visible');
    
      // Enter negative values into the input fields
      cy.get('#new-minFloor').clear().type('80');
      cy.get('#new-maxFloor').clear().type('100');
    
      // Click the button to get buildings in floor range
      cy.get('#list-building-min-max-floor').click();
    
      // Check if the warning toast is visible
      cy.get('.toast-warning').should('be.visible').contains('Nenhum dado disponível!');
      
      // Ensure that the results are not displayed
      cy.get('.form-container-result').should('not.exist');
    });   
  });
  