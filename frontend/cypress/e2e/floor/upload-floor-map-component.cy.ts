import test from '../../fixtures/test.json';
import 'cypress-file-upload';
describe('UploadFloorsMapComponent', () => {
  beforeEach(() => {
    cy.visit('/floor');
    cy.get('#UpdateMap').click();
  });

  it('should display the initial state', () => {
    cy.get('.form-container').should('exist');
    cy.get('#building-select').should('have.length.greaterThan', 0);

    cy.get('#floor-select').should('have.length.greaterThan', 0);
    cy.get('#json-file').should('exist');
  });

  it('should select a building and floor', () => {
    cy.get('.form-container').should('exist');
    cy.get('#building-select').select('B');
    cy.get('#floor-select').select('Floor B1');

    cy.get('#json-file').should('exist');
  });

  it('should upload a JSON file', () => {

    const filePath = './test.json';

    cy.get('#json-file').click();

    cy.fixture(filePath).then((file) => {
      expect(file.maze, 'the same data').to.deep.equal(test.maze)
      
    }).as('adminJSON');

    cy.fixture(filePath).then((file) => {
      cy.get('#json-file').attachFile({
        fileContent: file,
        fileName: 'test.json',
        mimeType: 'application/json',
      });
    });
  });


  it('should submit the form', () => {

    const filePath = './test.json';

    cy.get('#building-select').select('B');
    cy.get('#floor-select').select('Floor B1');
   
    cy.fixture(filePath).then((file) => {
      cy.get('#json-file').attachFile({
        fileContent: file,
        fileName: 'test.json',
        mimeType: 'application/json',
      });
    });
    
    cy.get('#json-file').click();
    // Haz clic en "Enviar Mapa"
    cy.get('#UpdateFloor').click();
    cy.get('.toast-success').should('be.visible');
  });
  
});


