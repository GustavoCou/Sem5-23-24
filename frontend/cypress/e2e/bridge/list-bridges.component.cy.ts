describe('List Bridges Test', () => {
  it('lista as bridges', () => {

    cy.visit('http://localhost:4200/bridge');


    cy.get('.option-button').contains('Listar Passagens').click();
    cy.contains('button', 'Obter todas as passagens').click();

    cy.get('.form-container2').should('be.visible');
    cy.get('table').find('tr').its('length').should('be.gt', 1); // Verifica se ha linhas na tabela
  });



  it('mostra mensagem quando a lista de bridge esta vazia', () => {

    //retorna a lista vazia com pontes
    cy.intercept('GET', 'http://localhost:4000/api/bridge', []).as('getBridges');
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Listar Passagens').click();
    cy.contains('button', 'Obter todas as passagens').click();
    cy.wait('@getBridges');

    cy.contains('Nenhuma passagem encontrada').should('be.visible');

  });


  it('lista as bridges todas mesmo com a seleção de um edifício', () => {
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Listar Passagens').click();


    //Edificio esta na base de dados -> se for apagado nao funciona
    cy.get('.form-control2').first().select('A');
    cy.contains('button', 'Obter todas as passagens').click();

    cy.get('.form-container2').should('be.visible');
    cy.get('table').find('tr').its('length').should('be.gt', 1);
  });

  it('obtém todas as passagens entre dois edifícios', () => {
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Listar Passagens').click();
    cy.get('.form-control2').first().select('A');

    cy.get('.form-control2').eq(1).select('B');

    cy.contains('button', 'Obter todas as passagens entre dois edificios').click();

    cy.get('.form-container2').should('be.visible');
    cy.get('table').find('tr').its('length').should('be.gt', 1);
  });

  it('mostra mensagem quando não há passagens entre os dois edificios', () => {
    cy.visit('http://localhost:4200/bridge');



    cy.get('.option-button').contains('Listar Passagens').click();

    //VALORES DA BASE DE DADOS -> Se se criar uma ponte entre estes dois edificios o teste falha
    cy.get('.form-control2').first().select('C');


    cy.get('.form-control2').eq(1).select('B');

    cy.contains('button', 'Obter todas as passagens entre dois edificios').click();


    cy.contains('Não há passagens entre os dois edificios selecionados').should('be.visible');
  });

  it('valida a seleção de ambos os edifícios antes de procurar as pontes', () => {
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Listar Passagens').click();
    cy.contains('button', 'Obter todas as passagens entre dois edificios').click();
    cy.contains('Deve introduzir o Id de dois Edificios').should('be.visible');
  });

  it('mensagem em caso de falha de conexão com servidor', () => {
    cy.intercept('GET', 'http://localhost:4000/api/bridge', {
      forceNetworkError: true
    }).as('getBridgesFail');

    cy.visit('http://localhost:4200/bridge');
    cy.get('.option-button').contains('Listar Passagens').click();
    cy.contains('button', 'Obter todas as passagens').click();

    cy.wait('@getBridgesFail');
    cy.contains('Erro de conexão. Certifique-se de que o servidor está em execução.', { timeout: 10000 }).should('be.visible');
  });



});


