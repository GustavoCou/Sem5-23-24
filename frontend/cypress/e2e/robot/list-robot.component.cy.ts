
describe('List Robot Component Tests', () => {
    beforeEach(() => {
        
        cy.intercept('GET', '**/robot/list', [{ id: 'Robot1' }, { id: 'Robot2' }]).as('getRobots');
        cy.visit('http://localhost:4200/robot');
        cy.contains('button', 'Listar Robots').click();
    });

    it('mostrar a lista de robots', () => {
        
        cy.get('.robot-grid').should('be.visible');
        cy.get('.robot-card').should('have.length.at.least', 1);
    });

    it('inibir um robot da lista', () => {
        cy.get('.robot-card').first().find('button').click();

    });

    it('mostrar detalhes do robot', () => {
        cy.get('.robot-card').first().trigger('mouseover');
    });

    it('esconder detalhes do robot', () => {
        cy.get('.robot-card').first().trigger('mouseover').trigger('mouseleave');
    });

    it('navegar de volta', () => {

        cy.get('.back-button').click();

 
  
    });

    // Add more test cases
});

