describe('Create Floor Functionality', () => {
    beforeEach(() => {
      // Visit the page where the floor creation form is present
      cy.visit('/robot-type');
      cy.get('#CreateRobotTypeButton').click();
    });
  
    it('should create a new RobotType', () => {
      cy.get('#new-robotType').type('0010');
      cy.get('#new-robotModel').type('Renault');
      cy.get('#new-brand').type('Clio');
      cy.get('#new-tasks').select('Vigilância');

      cy.get('#CreateRobotTypeSubmitButton').click();

      cy.get('.toast-success').should('be.visible');
    });

    it('should throw error due to lack of data', () => {
      // Add Cypress commands to interact with the form inputs
      //cy.get('#new-floor').type('');
      cy.get('#new-robotModel').type('Renault');
      cy.get('#new-brand').type('Clio');
      cy.get('#new-tasks').select('Vigilância');

      cy.get('#CreateRobotTypeSubmitButton').click();

      cy.get('.toast-error').should('be.visible');
    });

    it('should throw error ID', () => {
      cy.get('#new-robotType').type('0001');
      cy.get('#new-robotModel').type('Renault');
      cy.get('#new-brand').type('Clio');
      cy.get('#new-tasks').select('Vigilância');
  
      cy.get('#CreateRobotTypeSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-error').should('be.visible');
    });

    it('should throw error model', () => {
      cy.get('#new-robotType').type('0010');
      cy.get('#new-robotModel').type('a'.repeat(251));
      cy.get('#new-brand').type('Clio');
      cy.get('#new-tasks').select('Vigilância');
  
      cy.get('#CreateRobotTypeSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-error').should('be.visible');
    });

    it('should throw error brand', () => {
      cy.get('#new-robotType').type('0010');
      cy.get('#new-robotModel').type('Renault');
      cy.get('#new-brand').type('a'.repeat(251));
      cy.get('#new-tasks').select('Vigilância');
  
      cy.get('#CreateRobotTypeSubmitButton').click();

      // Check if the warning toast is visible
      cy.get('.toast-error').should('be.visible');
    });
  });
  