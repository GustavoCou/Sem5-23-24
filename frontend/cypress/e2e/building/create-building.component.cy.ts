describe('Create Building test', () => {
    beforeEach(() => {
        cy.visit('/building')
        cy.get('#btnCriarEdificio').click();
    });

    it('should fill out the form and submit successfully', () => {

        cy.intercept('POST', '/building/create/').as('createBuildingRequest');

        
        cy.get('[formControlName="id"]').type('AAA');
        cy.get('[formControlName="name"]').type(' Edificio');
        cy.get('[formControlName="description"]').type(' Edificio');
        cy.get('[formControlName="width"]').type('10');
        cy.get('[formControlName="depth"]').type('5');
    
        cy.get('form').submit();
    
        cy.get('#btnCriarEdificio').click();
     
        
        cy.get('.toast-success').should('be.visible');
      });
    
      it('should show an error message when form submission fails', () => {
        
    
        
        cy.get('[formControlName="name"]').type(' Edificio');
        cy.get('[formControlName="description"]').type('Edificio');
        cy.get('[formControlName="width"]').type('10');
        cy.get('[formControlName="depth"]').type('15');
    
        cy.get('form').submit();
        cy.get('#btnCriarEdificio').click();
    
        cy.get('.toast-error').should('be.visible');
      });


      it('should show an error message when form submission the limit maximum of size', () => {

        cy.intercept('POST', '/building/create/').as('createBuildingRequest');

        
        cy.get('[formControlName="id"]').type('ABAA');
        cy.get('[formControlName="name"]').type(' Edificio');
        cy.get('[formControlName="description"]').type(' Edificio');
        cy.get('[formControlName="width"]').type('10');
        cy.get('[formControlName="depth"]').type('20');
    
        cy.get('form').submit();
    
        cy.get('#btnCriarEdificio').click();
     
        
        cy.get('.toast-error').should('be.visible');
      });
    });
    
