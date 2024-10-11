import test from '../../fixtures/test.json';
import 'cypress-file-upload';

describe('ListTaskNotApprovedComponent', () => {
  beforeEach(() => {
    cy.visit('/task');
  });

  it('should display a list of pending tasks', () => {
    cy.wait(2000);
    cy.get('#btnListarPendentes').click();
    cy.get('.task-item').should('have.length.greaterThan', 0);
  });

  it('should approve a task correctly', () => {
    cy.wait(2000);
    cy.get('#btnListarPendentes').click();
    cy.wait(2000);
    let initialTaskCount = 0;
    cy.get('.task-item').its('length').then((count) => {
      initialTaskCount = count;
    });

    cy.get('.task-item').first().within(() => {
      cy.get('.approve').click();
    });
  });

  it('should reject a task correctly', () => {
    cy.wait(2000);
    cy.get('#btnListarPendentes').click();
    cy.wait(2000);
    let initialTaskCount = 0;
    cy.get('.task-item').its('length').then((count) => {
      initialTaskCount = count;
    });

    cy.get('.task-item').first().within(() => {
      cy.get('.reject').click();
    });
  });

  it('should navigate back correctly', () => {
    cy.get('#BackToMenu').click();
  });

  it('should display a message when the task list is empty', () => {

    cy.intercept('GET', '**/task/pending*', { body: { taskRequestDto: [] } }).as('getEmptyList');
    cy.visit('/task');


    cy.wait(2000);

    cy.get('#btnListarPendentes').click();
    cy.wait('@getEmptyList');

    cy.get('.task-item').should('not.exist');
    cy.contains('Não existem requisiçoes pendentes');
  });



  it('should display an error message when something went wrong', () => {

    cy.intercept('GET', '**/task/pending*', {
      statusCode: 500,
      body: 'error'
    }).as('getError');

    cy.visit('/task');
    cy.wait(2000);
    cy.get('#btnListarPendentes').click();

    cy.wait('@getError');
    cy.contains('Erro ao carregar lista de tarefas. Tente novamente mais tarde.', { timeout: 10000 });
  });

});
