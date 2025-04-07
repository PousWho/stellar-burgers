import { deleteCookie, setCookie } from '../../src/utils/cookie';
const URL = "https://norma.nomoreparties.space/api";

describe('Тест конструктора бургеров', () => {
  beforeEach(() => {
    setCookie('accessToken', 'Bearer vtLhzGciOiJDYUzI1NiIsIgR5nCI6IkpXYCq9...');
    localStorage.setItem('refreshToken', '8bfcd5c777baeb92ad3193a7fc7322c1...');

    cy.intercept('GET', `${URL}/auth/user`, { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', `${URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', `${URL}/orders`, { fixture: 'order.json' }).as('orderBurgerApi');
    cy.visit('');
    cy.wait('@getUser');
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Тест получения списка ингредиентов с сервера (булка + начинка)', () => {
    cy.get('[data-cy="constructor"]').as('constructor');
  
    // Добавляем булку и начинку
    cy.addIngredient('Краторная булка N-200i');
    cy.addIngredient('Биокотлета из марсианской Магнолии');
  
    // Проверка булки
    cy.get('@constructor')
      .find('.constructor-element__text')
      .should('contain', 'Краторная булка N-200i');
  
    // Проверка начинки
    cy.get('[data-cy="constructor-ingredient"]')
      .should('contain', 'Биокотлета из марсианской Магнолии');
  });
  

  it('Тест открытия и закрытия модального окна', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal"]').as('modal');
    cy.get('@modal').should('exist');
    cy.get('@modal').should('contain', 'Краторная булка N-200i');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist');

    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('@modal').should('exist');

    cy.get('[data-cy="modal-overlay"]').click('left', {force: true});
    cy.get('@modal').should('not.exist');
  });
  

  it('Тест создания заказа (булка + начинка)', () => {
    cy.get('[data-cy="constructor"]').as('constructor');

    cy.addIngredient('Краторная булка N-200i'); // bun
    cy.addIngredient('Биокотлета из марсианской Магнолии'); // main

    cy.get('@constructor')
      .find('button')
      .contains('Оформить заказ')
      .click({ force: true });

    cy.wait('@orderBurgerApi');
    cy.get('[data-cy="modal"]').as('modal');
    cy.get('@modal').should('exist');

    cy.get('[data-cy="order-number"]', { timeout: 10000 }).should('contain', '98765');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist');

    // Проверка, что содержимое конструктора сброшено
    cy.get('@constructor')
  .should('not.contain', 'Краторная булка N-200i')
  .and('not.contain', 'Биокотлета из марсианской Магнолии');
  });
});
