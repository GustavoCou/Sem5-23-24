import test from '../../fixtures/test.json';
import 'cypress-file-upload';

describe('ApproveRejectUserComponent E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/manage-users');
  });

  it('should display the approve/reject user option', () => {
    cy.get('.option-button').should('contain', 'Aprovar/Rejeitar User').click();
    cy.get('app-approve-reject-user').should('be.visible');
  });

  it('should approve a user correctly', () => {
    cy.get('.option-button').click();
    cy.wait(2000);

    cy.get('.user-item').first().within(() => {
      cy.get('.approve').click();
    });
    cy.contains('Pedido de registo aceite com sucesso').should('be.visible');
  });

  it('should reject a user correctly', () => {
    cy.get('.option-button').click();
    cy.wait(2000);
    cy.get('.user-item').first().within(() => {
      cy.get('.reject').click();
    });
    cy.contains('Pedido de registo recusado com sucesso').should('be.visible');
  });

  it('should navigate back correctly', () => {
    cy.get('#BackToMenu').click();
    cy.url().should('include', '/home');
  });

  it('should display a message when there are no users to approve', () => {

    cy.intercept('GET', '**/Users/PendingUtentes*', []).as('getEmptyList');
    cy.get('.option-button').click();
    cy.wait('@getEmptyList');

    cy.get('.user-item').should('not.exist');
    cy.contains('Não existem utentes pendentes de aceitação').should('be.visible');
  });

  it('should display an error message when something went wrong', () => {

    cy.intercept('GET', '**/Users/PendingUtentes*', {
      statusCode: 500,
      body: 'error'
    }).as('getListError');

    cy.get('.option-button').click();
    cy.wait('@getListError');
    cy.contains('Erro ao carregar lista de utentes. Tente novamente mais tarde.', { timeout: 10000 }).should('be.visible');
  });
});
