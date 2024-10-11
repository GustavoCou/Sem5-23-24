describe('List Floor Bridges Test', () => {

  it('lista os pisos com pontes de um edificio', () => {

    cy.visit('http://localhost:4200/bridge');
    cy.get('.option-button').contains('Listar Pisos de Edificio com Passagem').click();

    //Edificio da base de dados -> apagando a ponte deste edificio da resultados diferentes
    cy.get('.form-control2').select('A');
    cy.get('button').contains('Submit').click();
    cy.get('table').should('be.visible');
  });

  it('exibe mensagem quando não há edifícios', () => {
    cy.intercept('GET', 'http://localhost:4000/api/building/list', []).as('getBuildings');

    cy.visit('http://localhost:4200/bridge');
    cy.get('.option-button').contains('Listar Pisos de Edificio com Passagem').click();
    cy.wait('@getBuildings');

    cy.contains('Nao existem edificios para escolher').should('be.visible');
  });

  it('verifica quando o edifício selecionado não tem pisos', () => {
    cy.visit('http://localhost:4200/bridge');
    cy.get('.option-button').contains('Listar Pisos de Edificio com Passagem').click();

    // Edificio da base de dados
    cy.get('.form-control2').select('78A');

    cy.get('button').contains('Submit').click();

    cy.contains('Não existem pisos neste edificio com passagens').should('be.visible');
  });


  it('valida que é preciso um edificio para submeter pedido', () => {
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Listar Pisos de Edificio com Passagem').click();
    cy.get('button').contains('Submit').click();

    cy.contains('Selecione um edificio').should('be.visible');
  });

  it('verifica quando o edifício selecionado não tem passagens', () => {
    cy.visit('http://localhost:4200/bridge');
    cy.get('.option-button').contains('Listar Pisos de Edificio com Passagem').click();

    //se o edificio for apagado nao consigo fazer este teste
    cy.get('.form-control2').select('78A');
    cy.intercept('GET', 'http://localhost:4000/api/bridge/78A', {
      statusCode: 404,
      body: []
    }).as('getBridgesEmpty');


    cy.get('button').contains('Submit').click();

    cy.wait('@getBridgesEmpty');

    cy.contains('Não existem pisos neste edificio com passagens').should('be.visible');
  });

  it('mensagem em caso de falha de conexão com servidor', () => {
    cy.intercept('GET', 'http://localhost:4000/api/building/list', {
      forceNetworkError: true
    }).as('getServerFail');

    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Listar Pisos de Edificio com Passagem').click();

    cy.wait('@getServerFail');

    cy.contains('Erro de conexão. Certifique-se de que o servidor está em execução.', { timeout: 10000 }).should('be.visible');
  });










})