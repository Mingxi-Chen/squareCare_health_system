// const baseURL = "http://localhost:3000";
const baseURL = 'https://yunjiaapp-c337d89ea438.herokuapp.com';

describe("The Home Page", () => {
  it("successfully loads", () => {
    // testing whether load the page successfully under correct configuration.
    cy.visit(`${baseURL}/?`);
  });
});

Cypress.Commands.add("slowCommand", (ms = 1000) => {
  cy.wait(ms);
});

// login with specific email and password
describe("Hospital Admin", () => {
  it("successfully filled the form", () => {
    cy.visit(`${baseURL}/?`);
    cy.get("#email").type("hospitaladmin@gmail.c");
    cy.get("#password").type("1234567890");

    cy.get("#submit_button").click();
    cy.slowCommand(1000);

    cy.get("#logo").click();
    cy.slowCommand(3000);

    cy.get("#logout_button").click();
  });
});

describe("System Admin", () => {
  it("successfully filled the form", () => {
    cy.visit(`${baseURL}/?`);
    cy.get("#email").type("systemadmin@gmail.c");
    cy.get("#password").type("1234567890");
    cy.get("#submit_button").click();
    cy.slowCommand(1000);
    cy.get("#logo").click();
    cy.slowCommand(3000);
    cy.get("#logout_button").click();
  });
});
