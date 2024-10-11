// cypress/integration/list-floors-building.spec.js

describe('ListFloorsBuildingComponent', () => {
  beforeEach(() => {
    cy.visit('/elevator');
    cy.get('.option-button').contains('Listar Pisos de Edifício servidos por elevador').click();
  });

  it('should load buildings and list floors served by elevator', () => {
    // to wait for the asynchronous data to be loaded.
    cy.wait(1000);

    // Ensure the building select is visible
    cy.get('#building-select').should('be.visible');

    cy.get('#building-select').select('EdificioA');
    cy.get('#list-floors-building').click();

    // Wait for the API request to complete
    cy.wait(1000);

    cy.get('.form-container-result').should('be.visible');
    cy.get('.form-container-result b').should('have.length.greaterThan', 0);
    cy.get('.form-container-result ul').should('have.length.greaterThan', 0);
  });
});
