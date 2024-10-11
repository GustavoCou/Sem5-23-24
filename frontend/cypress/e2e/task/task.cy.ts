describe('Task test', () => {
  beforeEach(() => {
    cy.visit('/task');

    // Haz clic en el enlace "Gerir tarefas"
    cy.get('#btnCriarTask').click();
  });

  it('should fill out the form and submit successfully a Security Task', () => {
    cy.intercept('POST', '/task/').as('createBuildingRequest');
    cy.get('#security-button').click();
    cy.get('[formControlName="robot"]').type('0001');
    cy.get('#building-select').select('B');
    cy.get('#floor-select').select('B1');
    cy.get('[formControlName="emContactName"]').type('Willy');
    cy.get('[formControlName="emContactPhone"]').type(925654789);


    cy.get('#submitSecurityTask').click();

    cy.get('.toast-success').should('be.visible');
    cy.wait(5000)
  });



    it('should fill out the form and submit successfully a Pickup Delivery Task', () => {
      cy.intercept('POST', '/task/').as('createTaskRequest');
      cy.get('#pickup-button').click(); // Cambia al formulario pickupDeliveryTask
      cy.get('[formControlName="robot"]').type('0001');
      cy.get('[formControlName="pickupRoom"]').type('B106');
      cy.get('[formControlName="deliveryRoom"]').type('B104');
      cy.get('[formControlName="pickupContactName"]').type('John Doe');
      cy.get('[formControlName="pickupContactPhone"]').type(987654321);
      cy.get('[formControlName="deliveryContactName"]').type('Ana Doe');
      cy.get('[formControlName="deliveryContactPhone"]').type(987654321);
      cy.get('[formControlName="validationCode"]').type("AAMMFS");
      cy.get('[formControlName="descriptionDelivery"]').type("sends to test");

      cy.get('#submitPickUpTask').click();

      cy.get('.toast-success').should('be.visible');
      cy.wait(5000)

    });


  it('should fill without  select building and show error message', () => {
    cy.intercept('POST', '/task/').as('createBuildingRequest');
    cy.get('#security-button').click();
    cy.get('[formControlName="robot"]').type('0001');
   cy.get('[formControlName="emContactName"]').type('Willy');
    cy.get('[formControlName="emContactPhone"]').type(925654789);


    cy.get('#submitSecurityTask').click();

    cy.get('.toast-error').should('be.visible');
    cy.wait(5000)
  });


  it('should fill without  select floor and show error message', () => {
    cy.intercept('POST', '/task/').as('createBuildingRequest');
    cy.get('#security-button').click();
    cy.get('[formControlName="robot"]').type('0001');
    cy.get('#building-select').select('B');
    cy.get('[formControlName="emContactName"]').type('Willy');
    cy.get('[formControlName="emContactPhone"]').type(925654789);


    cy.get('#submitSecurityTask').click();

    cy.get('.toast-error').should('be.visible');
    cy.wait(5000)
  });

  it('should fill without  contact name  and show error message', () => {
    cy.intercept('POST', '/task/').as('createBuildingRequest');
    cy.get('#security-button').click();
    cy.get('[formControlName="robot"]').type('0001');
    cy.get('#building-select').select('B');
    cy.get('#floor-select').select('B1');
    cy.get('[formControlName="emContactPhone"]').type(925654789);


    cy.get('#submitSecurityTask').click();

    cy.get('.toast-error').should('be.visible');
    cy.wait(5000)
  });

  it('should fill without  contact phone  and show error message', () => {
    cy.intercept('POST', '/task/').as('createBuildingRequest');
    cy.get('#security-button').click();
    cy.get('[formControlName="robot"]').type('0001');
    cy.get('#building-select').select('B');
    cy.get('#floor-select').select('B1');
    cy.get('[formControlName="emContactPhone"]').type(925654789);


    cy.get('#submitSecurityTask').click();

    cy.get('.toast-error').should('be.visible');
    cy.wait(5000)
  });

  it('should fill with  contact phone (without 9 characters)  and show error message', () => {
    cy.intercept('POST', '/task/').as('createBuildingRequest');
    cy.get('#security-button').click();
    cy.get('[formControlName="robot"]').type('0001');
    cy.get('#building-select').select('B');
    cy.get('#floor-select').select('B1');
    cy.get('[formControlName="emContactName"]').type('Willy');
    cy.get('[formControlName="emContactPhone"]').type(8885);



    cy.get('#submitSecurityTask').click();

    cy.get('.toast-error').should('be.visible');
    cy.wait(5000)
  });
});
