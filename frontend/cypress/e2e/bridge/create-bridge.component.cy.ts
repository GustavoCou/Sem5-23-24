describe('Create Bridge Testes', () => {
  it('cria uma nova ponte com dados validos', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Criar Passagem').click();

    cy.get('input[formControlName=bridgeId]').type('AC12');
    cy.get('input[formControlName=bridgeXPosX]').type('1');
    cy.get('input[formControlName=bridgeXPosY]').type('1');
    cy.get('input[formControlName=bridgeYPosX]').type('1');
    cy.get('input[formControlName=bridgeYPosY]').type('1');
    cy.get('select[formControlName=buildingIdX]').select('A');
    cy.get('select[formControlName=floorIdX]').select('A2');
    cy.get('select[formControlName=buildingIdY]').select('B');
    cy.get('select[formControlName=floorIdY]').select('B2');

    cy.get('button').contains('Criar Passagem').click();
    cy.get('.toast-success').should('be.visible');
  });

  it('tenta criar uma passagem sem todos os dados', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Criar Passagem').click();

    //valido para todos basta comentar
    //cy.get('input[formControlName=bridgeId]').type('AC12');
    cy.get('input[formControlName=bridgeXPosX]').type('1');
    cy.get('input[formControlName=bridgeXPosY]').type('1');
    cy.get('input[formControlName=bridgeYPosX]').type('1');
    cy.get('input[formControlName=bridgeYPosY]').type('1');
    cy.get('select[formControlName=buildingIdX]').select('A');
    cy.get('select[formControlName=floorIdX]').select('A2');
    cy.get('select[formControlName=buildingIdY]').select('B');
    cy.get('select[formControlName=floorIdY]').select('B2');

    cy.get('button').contains('Criar Passagem').click();
    cy.contains('Deve preencher todos os campos').should('be.visible');

  });

  it('tenta criar uma ponte sem o id válido', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Criar Passagem').click();


    cy.get('input[formControlName=bridgeId]').type('TESTEFALHAR');
    cy.get('input[formControlName=bridgeXPosX]').type('1');
    cy.get('input[formControlName=bridgeXPosY]').type('1');
    cy.get('input[formControlName=bridgeYPosX]').type('1');
    cy.get('input[formControlName=bridgeYPosY]').type('1');
    cy.get('select[formControlName=buildingIdX]').select('A');
    cy.get('select[formControlName=floorIdX]').select('A2');
    cy.get('select[formControlName=buildingIdY]').select('B');
    cy.get('select[formControlName=floorIdY]').select('B2');

    cy.get('button').contains('Criar Passagem').click();
    cy.contains('Erro ao criar a passagem. Bridge Id not allowed').should('be.visible');
  });


  it('tenta criar uma ponte com pisos já conectados', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Criar Passagem').click();

    cy.get('input[formControlName=bridgeId]').type('ABBA');
    cy.get('input[formControlName=bridgeXPosX]').type('1');
    cy.get('input[formControlName=bridgeXPosY]').type('1');
    cy.get('input[formControlName=bridgeYPosX]').type('1');
    cy.get('input[formControlName=bridgeYPosY]').type('1');
    cy.get('select[formControlName=buildingIdX]').select('A');
    cy.get('select[formControlName=floorIdX]').select('A2');
    cy.get('select[formControlName=buildingIdY]').select('B');
    cy.get('select[formControlName=floorIdY]').select('B2');

    cy.get('button').contains('Criar Passagem').click();
    cy.contains('Erro ao criar a passagem. Floors are already connected').should('be.visible');

  });

  it('tenta criar uma ponte com um id duplicado', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Criar Passagem').click();

    cy.get('input[formControlName=bridgeId]').type('AC12');
    cy.get('input[formControlName=bridgeXPosX]').type('1');
    cy.get('input[formControlName=bridgeXPosY]').type('1');
    cy.get('input[formControlName=bridgeYPosX]').type('1');
    cy.get('input[formControlName=bridgeYPosY]').type('1');
    cy.get('select[formControlName=buildingIdX]').select('A');
    cy.get('select[formControlName=floorIdX]').select('A2');
    cy.get('select[formControlName=buildingIdY]').select('B');
    cy.get('select[formControlName=floorIdY]').select('B2');

    cy.get('button').contains('Criar Passagem').click();
    cy.get('.toast-error').should('be.visible');
  });

  it('tenta criar uma ponte com os mesmos pisos mas de ordem trocada', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Criar Passagem').click();

    cy.get('input[formControlName=bridgeId]').type('0101');
    cy.get('input[formControlName=bridgeXPosX]').type('1');
    cy.get('input[formControlName=bridgeXPosY]').type('1');
    cy.get('input[formControlName=bridgeYPosX]').type('1');
    cy.get('input[formControlName=bridgeYPosY]').type('1');
    cy.get('select[formControlName=buildingIdX]').select('B');
    cy.get('select[formControlName=floorIdX]').select('B2');
    cy.get('select[formControlName=buildingIdY]').select('A');
    cy.get('select[formControlName=floorIdY]').select('A2');

    cy.get('button').contains('Criar Passagem').click();
    cy.get('.toast-error').should('be.visible');
  });

  it('mostra mensagem quando não há edificios suficientes', () => {
    cy.visit('http://localhost:4200/bridge');

    //simular o pedido da lista e o retorno de uma lista vazia
    cy.intercept('GET', '**/building/list', []).as('getBuildings');

    cy.get('.option-button').contains('Criar Passagem').click();

    // aguarda o retorno do getBuilding
    cy.wait('@getBuildings');

    cy.contains('Não existem edificios suficientes para criar uma passagem.').should('be.visible');
  });


  it('mostra uma mensagem quando o edificio escolhido nao tem pisos', () => {
    cy.visit('http://localhost:4200/bridge');

    //simula pedidos http para o ir buscar a lista de buildings e os pisos desses edificios
    cy.intercept('GET', '**/building/list', [{ id: 'Building1' }, { id: 'Building2' }]).as('getBuildings');

    cy.intercept('GET', '**/floor/get/Building1', []).as('getFloors');

    cy.get('.option-button').contains('Criar Passagem').click();

    cy.wait('@getBuildings');

    cy.get('select[formControlName=buildingIdX]').select('Building1');

    // espera resposta do http get floors
    cy.wait('@getFloors');

    cy.contains('Nenhum Piso encontrado para o edificio selecionado').should('be.visible');
  });

  it('mostra mensagem quando não é possivel obter a lista de edificios cod 500', () => {

    cy.visit('http://localhost:4200/bridge');

    cy.intercept('GET', '**/building/list', {
      statusCode: 500,
      body: 'Server error'
    }).as('getBuildingsFailed');

    cy.get('.option-button').contains('Criar Passagem').click();
    cy.wait('@getBuildingsFailed');

    cy.contains('Erro ao carregar edifícios. Tente novamente mais tarde.', { timeout: 10000 }).should('be.visible');
  });


  it('mostra mensagem quando não for possível obter conexão com o server ', () => {
    cy.visit('http://localhost:4200/bridge');

    //simula falha 
    cy.intercept('GET', '**/building/list', {
      forceNetworkError: true
    }).as('getBuildingsFailed');

    cy.get('.option-button').contains('Criar Passagem').click();
    cy.wait('@getBuildingsFailed');

    cy.contains('Erro de conexão. Certifique-se de que o servidor está em execução.', { timeout: 10000 }).should('be.visible');
  });


  it('deve mostrar uma mensagem de erro quando os pisos selecionados estão no mesmo edifício', () => {
    cy.visit('http://localhost:4200/bridge');

    cy.get('.option-button').contains('Criar Passagem').click();

    cy.get('input[formControlName=bridgeId]').type('ABCD');
    cy.get('input[formControlName=bridgeXPosX]').type('1');
    cy.get('input[formControlName=bridgeXPosY]').type('1');
    cy.get('input[formControlName=bridgeYPosX]').type('1');
    cy.get('input[formControlName=bridgeYPosY]').type('1');
    cy.get('select[formControlName=buildingIdX]').select('A');
    cy.get('select[formControlName=floorIdX]').select('A2');
    cy.get('select[formControlName=buildingIdY]').select('A');
    cy.get('select[formControlName=floorIdY]').select('A1');

    cy.get('button').contains('Criar Passagem').click();

    cy.contains('Erro ao criar a passagem. Floors are in the same building. Bridge not created').should('be.visible');
  });

});







