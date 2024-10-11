describe('Edit Bridge Testes', () => {
  it('Edita uma ponte com dados válidos', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Editar Passagem').click();

    //Id que ja existe na base de dados -> se deixar de existir nao funciona
    cy.get('select[formControlName="bridgeId"]').select('AC12');

    //alteracao das coordenadas, p.ex
    cy.get('input[formControlName="bridgeXPosX"]').clear().type('2');
    cy.get('input[formControlName="bridgeXPosY"]').clear().type('3');
    cy.get('input[formControlName="bridgeYPosX"]').clear().type('4');
    cy.get('input[formControlName="bridgeYPosY"]').clear().type('5');

    //alteraçao tbm de um dos pisos
    cy.get('select[formControlName="buildingIdX"]').select('A');
    cy.get('select[formControlName="floorIdX"]').select('A1');
    cy.get('select[formControlName="buildingIdY"]').select('C');
    cy.get('select[formControlName="floorIdY"]').select('C4');

    cy.get('button').contains('Editar Passagem').click();

    cy.get('.toast-success').should('be.visible');
  });

  it('Mostra mensagem quando não há pontes disponíveis para editar', () => {

    //simula pedido com lista vazia
    cy.intercept('GET', 'bridge', []).as('getBridges');
    cy.visit('http://localhost:4200/edit-bridge');

    //espera pelo pedido
    cy.wait('@getBridges');
    cy.contains('Não existem passagens disponiveis para editar').should('be.visible');
  });


  it('tenta editar uma ponte para pisos já conectados', () => {
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Editar Passagem').click();

    //Id que ja existe na base de dados -> se deixar de existir nao funciona
    cy.get('select[formControlName="bridgeId"]').select('AC12');

    cy.get('input[formControlName="bridgeXPosX"]').clear().type('2');
    cy.get('input[formControlName="bridgeXPosY"]').clear().type('3');
    cy.get('input[formControlName="bridgeYPosX"]').clear().type('4');
    cy.get('input[formControlName="bridgeYPosY"]').clear().type('5');

    cy.get('select[formControlName="buildingIdX"]').select('A');
    cy.get('select[formControlName="floorIdX"]').select('A2');
    cy.get('select[formControlName="buildingIdY"]').select('B');
    cy.get('select[formControlName="floorIdY"]').select('B2');

    cy.get('button').contains('Editar Passagem').click();

    cy.contains('Erro ao editar a passagem. Floors are already connected').should('be.visible');
  });


  it('tenta editar uma ponte para pisos já conectados com ordem trocada', () => {
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Editar Passagem').click();

    //Id que ja existe na base de dados -> se deixar de existir nao funciona
    cy.get('select[formControlName="bridgeId"]').select('AC12');

    cy.get('input[formControlName="bridgeXPosX"]').clear().type('2');
    cy.get('input[formControlName="bridgeXPosY"]').clear().type('3');
    cy.get('input[formControlName="bridgeYPosX"]').clear().type('4');
    cy.get('input[formControlName="bridgeYPosY"]').clear().type('5');

    //alteraçao Ordem dos pisos
    cy.get('select[formControlName="buildingIdX"]').select('B');
    cy.get('select[formControlName="floorIdX"]').select('B2');
    cy.get('select[formControlName="buildingIdY"]').select('A');
    cy.get('select[formControlName="floorIdY"]').select('A2');

    cy.get('button').contains('Editar Passagem').click();

    cy.contains('Erro ao editar a passagem. Floors are already connected').should('be.visible');
  });


  it('mostra mensagem quando não há edificios suficientes', () => {
    cy.visit('http://localhost:4200/bridge');

    //simular o pedido da lista e o retorno de uma lista vazia
    cy.intercept('GET', '**/building/list', []).as('getBuildings');

    cy.get('.option-button').contains('Editar Passagem').click();

    // aguarda o retorno do getBuilding
    cy.wait('@getBuildings');

    cy.contains('Não existem edificios suficientes para criar uma passagem.').should('be.visible');
  });

  it('não é possível obter conexão com o server ', () => {
    cy.visit('http://localhost:4200/bridge');

    //simula falha 
    cy.intercept('GET', '**/building/list', {
      forceNetworkError: true
    }).as('getBuildingsFailed');

    cy.get('.option-button').contains('Editar Passagem').click();
    cy.wait('@getBuildingsFailed');

    cy.contains('Erro de conexão. Certifique-se de que o servidor está em execução.', { timeout: 10000 }).should('be.visible');
  });


  it('mostra uma mensagem quando o edificio escolhido para editar nao tem pisos', () => {
    cy.visit('http://localhost:4200/bridge');

    //lista de edificios com 2 edificios falsos
    cy.intercept('GET', '**/building/list', [{ id: 'Building1' }, { id: 'Building2' }]).as('getBuildings');

    // pedir o piso desse edificio
    cy.intercept('GET', '**/floor/get/Building1', []).as('getFloors');

    cy.get('.option-button').contains('Editar Passagem').click();

    cy.wait('@getBuildings');
    cy.get('select[formControlName="bridgeId"]').select('AC12');

    //escolhe edificio sem pisos
    cy.get('select[formControlName="buildingIdX"]').select('Building1');

    //tem a lista vazia 
    cy.wait('@getFloors');
    cy.contains('Nenhum Piso encontrado para o edificio selecionado').should('be.visible');
  });


  it('não é possivel obter a lista de edificios', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.intercept('GET', '**/building/list', {
      statusCode: 500,
      body: 'Server error'
    }).as('getBuildingsFailed');

    cy.get('.option-button').contains('Editar Passagem').click();
    cy.wait('@getBuildingsFailed');

    cy.contains('Erro ao carregar edifícios. Tente novamente mais tarde.', { timeout: 10000 }).should('be.visible');
  });


  it('tenta editar uma ponte com dois pisos do mesmo edificio', () => {
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Editar Passagem').click();

    //Id que ja existe na base de dados -> se deixar de existir nao funciona
    cy.get('select[formControlName="bridgeId"]').select('AC12');

    cy.get('input[formControlName="bridgeXPosX"]').clear().type('2');
    cy.get('input[formControlName="bridgeXPosY"]').clear().type('3');
    cy.get('input[formControlName="bridgeYPosX"]').clear().type('4');
    cy.get('input[formControlName="bridgeYPosY"]').clear().type('5');

    //alteraçao Ordem dos pisos
    cy.get('select[formControlName="buildingIdX"]').select('B');
    cy.get('select[formControlName="floorIdX"]').select('B1');
    cy.get('select[formControlName="buildingIdY"]').select('B');
    cy.get('select[formControlName="floorIdY"]').select('B2');

    cy.get('button').contains('Editar Passagem').click();

    cy.contains('Erro ao editar a passagem. Floors are in the same building.').should('be.visible');
  });

});







