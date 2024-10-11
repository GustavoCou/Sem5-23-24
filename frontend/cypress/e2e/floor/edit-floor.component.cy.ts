describe('Update Floor Functionality', () => {
    beforeEach(() => {
      // Visit the page where the floor update form is present
      cy.visit('/floor');
      cy.get('#UpdateFloorButton').click();
    });
  
    it('should update an existing floor', () => {
      // Add Cypress commands to interact with the form inputs
      cy.get('#floor-select').select('A1');
      cy.wait(1000);
      cy.get('#update-floor-description').clear().type('Updated Floor Description');
      cy.get('#update-floor-width').clear().type('7');
      cy.get('#update-floor-depth').clear().type('7');
  
      // Click the Update Floor button
      cy.get('#UpdateFloorSubmitButton').click();

      cy.get('.toast-success').should('be.visible');
    });

    it('should throw update description', () => {
      // Add Cypress commands to interact with the form inputs
      cy.get('#floor-select').select('A1');
      cy.wait(1000);
      cy.get('#update-floor-description').clear().type('Audtórios');
      cy.get('#update-floor-width').clear().type('5');
      cy.get('#update-floor-depth').clear().type('5');
  
      // Click the Update Floor button
      cy.get('#UpdateFloorSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-success').should('be.visible');
    });

    it('should throw update size', () => {
      // Add Cypress commands to interact with the form inputs
      cy.get('#floor-select').select('A1');
      cy.wait(1000);
      cy.get('#update-floor-description').clear().type('Audtórios');
      cy.get('#update-floor-width').clear().type('8');
      cy.get('#update-floor-depth').clear().type('5');

      // Click the Update Floor button
      cy.get('#UpdateFloorSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-success').should('be.visible');
    });
  });
  
  