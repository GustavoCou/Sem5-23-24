
describe('Create Robot Component Tests', () => {
    beforeEach(() => {
        
        cy.visit('http://localhost:4200/robot');

        cy.contains('button', 'Criar Robot').click();
    });

    it('verifica todos os campos presentes', () => {
      
        cy.get('[formControlName="id"]').should('exist');
        cy.get('[formControlName="nickName"]').should('exist');
        cy.get('[formControlName="description"]').should('exist');
        cy.get('[formControlName="serialNumber"]').should('exist');
        cy.get('[formControlName="robotTypeId"]').should('exist');
        cy.get('button[type="submit"]').should('exist');
        cy.get('.back-button').should('exist');
    });

    it('valida os campos do form e testa um form vazio', () => {
       
    });

    it('submete form com sucesso', () => {

        cy.get('[formControlName="id"]').type('12');
        cy.get('[formControlName="nickName"]').type('TestNickname');
        cy.get('[formControlName="description"]').type('Test Description: o robot e muito giro');
        cy.get('[formControlName="serialNumber"]').type('234sdf');
        cy.get('[formControlName="robotTypeId"]').type('1');

       
        cy.get('button[type="submit"]').click();

       
        // Adjust this to match how  app displays success messages->TODO
        //cy.get('.toast-success').should('be.visible');
    });

    it('gestao do erro de criação com form de info não permitida', () => {
        // Fill in the form fields with test data that are expected to fail
        cy.get('[formControlName="id"]').type('&%(&/&');
        cy.get('[formControlName="nickName"]').type('&%##/&%(/fdkfjhskdguhjsdk(/JNo89uoiuhwdweh');
        cy.get('[formControlName="description"]').type('Test Description to fail dsosidjashfkdhjfgksjhfkewurhkjbfw8447593478tyuiwrkrjgfbw33i4759irughksuieru0wo489iutgeorihngfowilerutoe84itueokrjghnorligfhoe8tu9eorighjowrjgbsldfhgfjoruiteo894te984ote0roigheorruirhrfgljsdfgllerirute89o94utoeirgliehrflhvodrigute985t0eroghoiledhflbkjdfnghlieurtotyileukrhe');
        cy.get('[formControlName="serialNumber"]').type('-%82398_97827387..4293847');
        

        
        cy.get('button[type="submit"]').click();

        
        // Adjust this to match how app displays error messages->TODO
        cy.get('.toast-error').should('be.visible');
    });

    it('navigates back when back button is clicked', () => {

        cy.get('.back-button').click();

         
        
    });

    // Add more tests 
});

