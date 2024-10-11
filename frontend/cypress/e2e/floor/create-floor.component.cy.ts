describe('Create Floor Functionality', () => {
    beforeEach(() => {
      // Visit the page where the floor creation form is present
      cy.visit('/floor');
      cy.get('#CreateFloorButton').click();
    });
  
    it('should create a new floor', () => {
      // Add Cypress commands to interact with the form inputs
      cy.get('#new-floor').type('Floor 1');
      cy.get('#new-description').type('Floor Description');
      cy.get('#new-width').type('5');
      cy.get('#new-depth').type('5');
      cy.get('#building-select').select('EdificioA');
  
      // Click the Create Floor button
      cy.get('#CreateFloorSubmitButton').click();

      cy.get('.toast-success').should('be.visible');
    });

    it('should throw error due to lack of data', () => {
      // Add Cypress commands to interact with the form inputs
      //cy.get('#new-floor').type('');
      cy.get('#new-description').type('Floor Description');
      cy.get('#new-width').type('5');
      cy.get('#new-depth').type('5');
      cy.get('#building-select').select('EdificioA');
  
      // Click the Create Floor button
      cy.get('#CreateFloorSubmitButton').click();

      cy.get('.toast-error').should('be.visible');
    });

    it('should throw error ID', () => {
      // Add Cypress commands to interact with the form inputs
      cy.get('#new-floor').type('invalidID123456789');
      cy.get('#new-description').type('Floor Description');
      cy.get('#new-width').type('5');
      cy.get('#new-depth').type('5');
      cy.get('#building-select').select('EdificioA');
  
      // Click the Create Floor button
      cy.get('#CreateFloorSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-error').should('be.visible');
    });

    it('should throw error description', () => {
      // Add Cypress commands to interact with the form inputs
      cy.get('#new-floor').type('Floor 3');
      cy.get('#new-description').type('a'.repeat(251));
      cy.get('#new-width').type('5');
      cy.get('#new-depth').type('5');
      cy.get('#building-select').select('EdificioA');
  
      // Click the Create Floor button
      cy.get('#CreateFloorSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-error').should('be.visible');
    });

    it('should throw error width', () => {
      // Add Cypress commands to interact with the form inputs
      cy.get('#new-floor').type('Floor 3');
      cy.get('#new-description').type('Floor Description');
      cy.get('#new-width').type('20');
      cy.get('#new-depth').type('5');
      cy.get('#building-select').select('EdificioA');
  
      // Click the Create Floor button
      cy.get('#CreateFloorSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-error').should('be.visible');
    });

    it('should throw error deph', () => {
      // Add Cypress commands to interact with the form inputs
      cy.get('#new-floor').type('Floor 3');
      cy.get('#new-description').type('Floor Description');
      cy.get('#new-width').type('6');
      cy.get('#new-depth').type('20');
      cy.get('#building-select').select('EdificioA');
  
      // Click the Create Floor button
      cy.get('#CreateFloorSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-error').should('be.visible');
    });
  });
  