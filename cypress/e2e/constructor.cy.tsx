import { setCookie, deleteCookie } from '../../src/utils/cookie';

const BASE_URL = 'https://norma.nomoreparties.space/api';
const SELECTORS = {
  builder: '[data-cy="builder"]',
  ingredientItem: '[data-cy="ingredient-item"]',
  modal: '[data-cy="modal"]',
  modalClose: '[data-cy="modal-close"]',
  modalOverlay: '[data-cy="modal-overlay"]',
  buns: '[data-cy="Булки"]',
  fillings: '[data-cy="Начинки"]'
};

describe('Проверка конструктора бургера (UI)', () => {
  beforeEach(() => {
    setCookie('accessToken', 'Bearer fake.token.for.test');
    localStorage.setItem('refreshToken', 'fake-refresh-token-123');

    cy.intercept('GET', `${BASE_URL}/auth/user`, { fixture: 'user.json' }).as(
      'userRequest'
    );
    cy.intercept('GET', `${BASE_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('ingredientsRequest');

    cy.visit('/');
    cy.wait('@userRequest');
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('добавление ингредиентов', () => {
    cy.get(SELECTORS.builder).as('zone');

    cy.get(SELECTORS.buns).find('button').first().click();
    cy.get(SELECTORS.fillings).find('button').first().click();

    cy.get('@zone').should('contain', 'Флюоресцентная булка R2-D3');
    cy.get('@zone').should('contain', 'Мясо бессмертных моллюсков Protostomia');
  });

  it('открытие и закрытие модалки ингредиента', () => {
    cy.get(SELECTORS.ingredientItem)
      .contains('Флюоресцентная булка R2-D3')
      .click();
    cy.get(SELECTORS.modal)
      .should('exist')
      .and('contain', 'Флюоресцентная булка R2-D3');

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');

    cy.get(SELECTORS.ingredientItem)
      .contains('Флюоресцентная булка R2-D3')
      .click();
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('создание заказа и отображение модального окна с номером', () => {
    cy.intercept('POST', `${BASE_URL}/orders`, { fixture: 'order.json' }).as(
      'orderRequest'
    );

    cy.get(SELECTORS.buns).find('button').first().click();
    cy.get(SELECTORS.fillings).find('button').first().click();

    cy.get(SELECTORS.builder)
      .find('button')
      .contains('Оформить заказ')
      .click({ force: true });

    cy.wait('@orderRequest');

    cy.get(SELECTORS.modal).as('orderModal').should('exist');
    cy.get('@orderModal').invoke('text').should('include', '13337');

    cy.get(SELECTORS.modalClose).click();
    cy.get('@orderModal').should('not.exist');

    cy.get(SELECTORS.builder).should(
      'not.contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(SELECTORS.builder).should(
      'not.contain',
      'Мясо бессмертных моллюсков Protostomia'
    );
  });
});
