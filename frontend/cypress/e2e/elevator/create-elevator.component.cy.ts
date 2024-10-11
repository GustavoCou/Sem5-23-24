describe('Create Elevator Test', () => {

  it('cria um elevador com dados válidos', () => {


    cy.visit('http://localhost:4200/elevator');

    cy.get('.option-button').contains('Criar Elevador').click();

    cy.get('input[formControlName=elevatorId]').type('E001');
    cy.get('input[formControlName=elevatorBrand]').type('Marca');
    cy.get('input[formControlName=elevatorModel]').type('Modelo');
    cy.get('input[formControlName=elevatorDescription]').type('Descricao');
    cy.get('input[formControlName=elevatorSerialNumber]').type('12347');
    cy.get('input[formControlName= elevatorPosX]').type('1');
    cy.get('input[formControlName= elevatorPosY]').type('1');
    cy.get('select[formControlName=buildingId]').select('A');
    cy.wait(1000);
    cy.get('select.form-control').eq(1).select('A1');

    cy.get('button').contains('CriarElevador').click();
    cy.get('.toast-success').should('be.visible');
  });


  it('tenta criar um elevador com marca mas sem modelo', () => {


    cy.visit('http://localhost:4200/elevator');

    cy.get('.option-button').contains('Criar Elevador').click();

    cy.get('input[formControlName=elevatorId]').type('E002');
    cy.get('input[formControlName=elevatorBrand]').type('Marca');
    //quando se coloca a marca tem de se ter o modelo
    cy.get('input[formControlName=elevatorDescription]').type('Descricao');
    cy.get('input[formControlName=elevatorSerialNumber]').type('12342');
    cy.get('input[formControlName= elevatorPosX]').type('1');
    cy.get('input[formControlName= elevatorPosY]').type('1');
    cy.get('select[formControlName=buildingId]').select('A');
    cy.wait(1000);
    cy.get('select.form-control').eq(1).select('A1');

    cy.get('button').contains('CriarElevador').click();
    cy.get('.toast-error').should('be.visible');
  });

  it('tenta criar um elevador com o mesmo ID', () => {


    cy.visit('http://localhost:4200/elevator');

    cy.get('.option-button').contains('Criar Elevador').click();

    cy.get('input[formControlName=elevatorId]').type('0001');
    cy.get('input[formControlName=elevatorBrand]').type('Marca');
    cy.get('input[formControlName=elevatorModel]').type('Modelo');
    cy.get('input[formControlName=elevatorDescription]').type('Descricao');
    cy.get('input[formControlName=elevatorSerialNumber]').type('12347');
    cy.get('input[formControlName= elevatorPosX]').type('1');
    cy.get('input[formControlName= elevatorPosY]').type('1');
    cy.get('select[formControlName=buildingId]').select('A');
    cy.wait(1000);
    cy.get('select.form-control').eq(1).select('A1');

    cy.get('button').contains('CriarElevador').click();
    cy.get('.toast-error').should('be.visible');
  });

  it('tenta criar um elevador com o mesmo Serial Number', () => {


    cy.visit('http://localhost:4200/elevator');

    cy.get('.option-button').contains('Criar Elevador').click();

    cy.get('input[formControlName=elevatorId]').type('0000');
    cy.get('input[formControlName=elevatorBrand]').type('Marca');
    cy.get('input[formControlName=elevatorModel]').type('Modelo');
    cy.get('input[formControlName=elevatorDescription]').type('Descricao');
    cy.get('input[formControlName=elevatorSerialNumber]').type('12345');
    cy.get('input[formControlName= elevatorPosX]').type('1');
    cy.get('input[formControlName= elevatorPosY]').type('1');
    cy.get('select[formControlName=buildingId]').select('A');
    cy.wait(1000);
    cy.get('select.form-control').eq(1).select('A1');

    cy.get('button').contains('CriarElevador').click();
    cy.get('.toast-error').should('be.visible');
  });

  it('tenta criar um elevador sem preencher um dado obrigatorio ex.ID', () => {


    cy.visit('http://localhost:4200/elevator');

    cy.get('.option-button').contains('Criar Elevador').click();

    // cy.get('input[formControlName=elevatorId]').type('0001');
    cy.get('input[formControlName=elevatorBrand]').type('Marca');
    cy.get('input[formControlName=elevatorModel]').type('Modelo');
    cy.get('input[formControlName=elevatorDescription]').type('Descricao');
    cy.get('input[formControlName=elevatorSerialNumber]').type('1231');
    cy.get('input[formControlName= elevatorPosX]').type('1');
    cy.get('input[formControlName= elevatorPosY]').type('1');
    cy.get('select[formControlName=buildingId]').select('A');
    cy.wait(1000);
    cy.get('select.form-control').eq(1).select('A1');

    cy.get('button').contains('CriarElevador').click();
    cy.contains('Por favor preencha os campos obrigatórios').should('be.visible');
  });

  it('tenta criar um elevador sem dados opcionais', () => {


    cy.visit('http://localhost:4200/elevator');

    cy.get('.option-button').contains('Criar Elevador').click();

    cy.get('input[formControlName=elevatorId]').type('1234');
    cy.get('input[formControlName= elevatorPosX]').type('1');
    cy.get('input[formControlName= elevatorPosY]').type('1');
    cy.get('select[formControlName=buildingId]').select('B');
    cy.wait(1000);
    cy.get('select.form-control').eq(1).select('B1');

    cy.get('button').contains('CriarElevador').click();
    cy.contains('Elevador Criado com Sucesso').should('be.visible');
  });

  it('mostra mensagem quando não há edificios disponiveis', () => {
    cy.intercept('GET', 'http://localhost:4000/api/building/list', []).as('getBuildings');
    cy.visit('http://localhost:4200/elevator');

    cy.get('.option-button').contains('Criar Elevador').click();

    cy.wait('@getBuildings');
    cy.contains('Nenhum Edificio encontrado. Não é possivel criar elevador').should('be.visible');
  });

  it('deve mostrar uma mensagem de nenhum piso encontrado', () => {
    cy.visit('http://localhost:4200/elevator');

    //simula pedidos http para o ir buscar a lista de buildings e os pisos desses edificios
    cy.intercept('GET', '**/building/list', [{ id: 'Building1' }]).as('getBuildings');

    cy.intercept('GET', '**/floor/get/Building1', []).as('getFloors');

    cy.get('.option-button').contains('Criar Elevador').click();

    cy.wait('@getBuildings');

    cy.get('select[formControlName=buildingId]').select('Building1');
    // espera resposta do http get floors
    cy.wait('@getFloors');

    cy.contains('O edifício selecionado não tem pisos.').should('be.visible');

  });

  it('adiciona um novo piso', () => {
    cy.visit('http://localhost:4200/elevator');
    cy.get('.option-button').contains('Criar Elevador').click();
    cy.get('input[formControlName=elevatorId]').type('0003');
    cy.get('input[formControlName= elevatorPosX]').type('1');
    cy.get('input[formControlName= elevatorPosY]').type('1');
    cy.get('select[formControlName=buildingId]').select('B');
    cy.wait(1000);
    cy.get('select.form-control').eq(1).select('B1');
    cy.get('.btn.btn-info', { timeout: 10000 }).click(); //espera caso demore


    cy.get('select.form-control').eq(2).select('B2');
    cy.get('select.form-control').should('have.length', 3); //é por causa do "titulo"

  });

  it('remove um piso', () => {
    cy.visit('http://localhost:4200/elevator');
    cy.get('.option-button').contains('Criar Elevador').click();
    cy.get('input[formControlName=elevatorId]').type('0003');
    cy.get('input[formControlName= elevatorPosX]').type('1');
    cy.get('input[formControlName= elevatorPosY]').type('1');
    cy.get('select[formControlName=buildingId]').select('B');
    cy.wait(1000);
    cy.get('select.form-control').eq(1).select('B1');
    cy.get('.btn.btn-info', { timeout: 10000 }).click(); //espera caso demore


    cy.get('select.form-control').eq(2).select('B2');
    cy.get('select.form-control').should('have.length', 3);

    // Remove um piso
    cy.get('.btn.btn-danger').first().click();
    cy.get('select.form-control').should('have.length', 2);


  });

  it('mostra mensagem quando não for possível obter conexão com o server ', () => {
    cy.visit('http://localhost:4200/elevator');

    //simula falha 
    cy.intercept('GET', '**/building/list', {
      forceNetworkError: true
    }).as('getBuildingsFailed');

    cy.get('.option-button').contains('Criar Elevador').click();
    cy.wait('@getBuildingsFailed');

    cy.contains('Erro de conexão. Certifique-se de que o servidor está em execução.', { timeout: 10000 }).should('be.visible');
  });

});


