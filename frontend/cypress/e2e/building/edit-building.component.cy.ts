describe('Edit Building Component', () => {
    beforeEach(() => {
      cy.visit('/building'); // Ajusta la ruta según la configuración de tu aplicación
      cy.get('#btnEditarEdificio').click();
    });
  
    it('should fill out the form and submit successfully', () => {

        
      cy.get('[formControlName="name"]').should('not.be.disabled');
      cy.get('[formControlName="description"]').should('not.be.disabled');
      cy.get('[formControlName="width"]').should('not.be.disabled');
      cy.get('[formControlName="depth"]').should('not.be.disabled');
  

      cy.get('#nameCheckbox').click();
      cy.get('#descriptionCheckbox').click();
      cy.get('#widthCheckbox').click();
      cy.get('#depthCheckbox').click();

      cy.get('[formControlName="id"]').type('AAA');
      cy.get('[formControlName="name"]').type('Novo Nome');
      cy.get('[formControlName="description"]').type('Nova Descripçao');
      cy.get('[formControlName="width"]').type('5');
      cy.get('[formControlName="depth"]').type('10');
  
   
      cy.get('form').submit();
      cy.get('#btnEditarEdificio').click();
      
   
      cy.get('.toast-success').should('be.visible');
    });

    it('should fill out the partial form and submit successfully', () => {

        
      cy.get('[formControlName="name"]').should('not.be.disabled');
      cy.get('[formControlName="description"]').should('not.be.disabled');
      cy.get('[formControlName="width"]').should('not.be.disabled');
      cy.get('[formControlName="depth"]').should('not.be.disabled');
  

      

      cy.get('#widthCheckbox').click();
      cy.get('#depthCheckbox').click();

      cy.get('[formControlName="id"]').type('AAA');
      cy.get('[formControlName="width"]').type('5');
      cy.get('[formControlName="depth"]').type('10');
  
   
      cy.get('form').submit();
      cy.get('#btnEditarEdificio').click();
      
   
      cy.get('.toast-success').should('be.visible');
    });

    it('Trying to edit a building without writing an ID ', () => {

        
      cy.get('[formControlName="name"]').should('not.be.disabled');
      cy.get('[formControlName="description"]').should('not.be.disabled');
      cy.get('[formControlName="width"]').should('not.be.disabled');
      cy.get('[formControlName="depth"]').should('not.be.disabled');
  

      

      cy.get('#widthCheckbox').click();
      cy.get('#depthCheckbox').click();

     // cy.get('[formControlName="id"]').type('AAA');
      cy.get('[formControlName="name"]').should('not.be.disabled');
      cy.get('[formControlName="description"]').should('not.be.disabled');
      cy.get('[formControlName="width"]').type('5');
      cy.get('[formControlName="depth"]').type('10');
  
   
      cy.get('form').submit();
      cy.get('#btnEditarEdificio').click();
      
   
      cy.get('.toast-error').should('be.visible');
    });
  });
  