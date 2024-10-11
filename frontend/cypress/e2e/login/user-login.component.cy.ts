describe('Testes de mudança de menu consoante utilisador', () => {

    beforeEach(() => {
      
      cy.visit('http://localhost:4200/login');
    });
  
    // Função para mock do login e obtenção do token
    const performLogin = (role: number, status = 1) => {
      // Mock da resposta do back end
      cy.intercept('POST', '**/Users/Authenticate', {
        statusCode: 200,
        body: {
          status: status,
          role: role,
          token: `fake-jwt-token-for-role-${role}`
        }
      }).as('loginRequest');
  
      // Login
      cy.get('[formControlName=email]').type(`user${role}@example.com`);
      cy.get('[formControlName=password]').type('password');
      cy.get('button[type=submit]').click();
    };
  
    // Testes para cada role
    it('Deve direccionar para menu de administrador', () => {
      performLogin(1);
      cy.url().should('include', '/menu-administrador');
    });
  
    it('Deve direccionar para menu de gestor de campus', () => {
      performLogin(2);
      cy.url().should('include', '/menu-gestor-de-campus');
    });
  
    it('Deve direccionar para menu de gestor de frota', () => {
      performLogin(3);
      cy.url().should('include', '/robot');
    });
  
    it('Deve direccionar para menu de gestor de tarefas', () => {
      performLogin(4);
      cy.url().should('include', '/menu-gestor-de-tarefas');
    });
  
    it('Deve direccionar para menu de utente', () => {
      performLogin(5);
      cy.url().should('include', '/menu-utente');
    });
  
    // Teste de credenciais erradas
    it('should not login with invalid credentials', () => {
      // Mock dum Login falhado
      cy.intercept('POST', '**/Users/Authenticate', {
        statusCode: 401,
        body: { status: 0 }
      }).as('loginRequest');
  
      cy.get('[formControlName=email]').type('invalid@example.com');
      cy.get('[formControlName=password]').type('wrongpassword');
      cy.get('button[type=submit]').click();
  
      // Verifica que se mantém na mesma página após casos de insucesso
      cy.url().should('include', 'http://localhost:4200/login');
    });
  
    
  });
  