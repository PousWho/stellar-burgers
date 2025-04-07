declare namespace Cypress {
    interface Chainable<Subject = any> {
      addIngredient(title: string): Chainable<any>;
    }
  }