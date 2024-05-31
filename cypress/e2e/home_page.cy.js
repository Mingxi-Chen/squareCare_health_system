// const baseURL = "http://localhost:3000/?";
const baseURL = 'https://yunjiaapp-c337d89ea438.herokuapp.com/?';

describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit(`${baseURL}/?`);
  });
});

Cypress.Commands.add("slowCommand", (ms = 1000) => {
  cy.wait(ms); // Wait for the specified time
});

describe("Login Page Element Presence", () => {
  beforeEach(() => {
    cy.visit(`${baseURL}/?`);
  });

  it("should display email, password, remember me, forgot password, and submit button", () => {
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
    cy.get('input[type="checkbox"]').should("exist");
    cy.get("#forget_password_button").should("exist");
    cy.get("#submit_button").should("exist");
  });
});

describe("Empty Email and Password", () => {
  it("successfully filled the form", () => {
    cy.visit(`${baseURL}/?`);
    cy.get("#submit_button").click();
    cy.slowCommand(1000);
  });
});

describe("Empty Password", () => {
  it("successfully filled the form", () => {
    cy.visit(`${baseURL}/?`);
    cy.get("#email").type("stonybrook@sbu.com");
    cy.get("#submit_button").click();
    cy.slowCommand(1000);
  });
});

describe("Empty Email", () => {
  it("successfully filled the form", () => {
    cy.visit(`${baseURL}/?`);
    cy.get("#password").type("12345678");
    cy.get("#submit_button").click();
    cy.slowCommand(1000);
  });
});

describe("Login Page Validation", () => {
  beforeEach(() => {
    cy.visit(`${baseURL}/?`);
  });

  it("should show an error for invalid email format", () => {
    const invalidEmail = "InvalidEmailFormat";
    cy.get("#email").type(invalidEmail);
    cy.get("#password").type("12345678");
    cy.get("#submit_button").click();
    cy.slowCommand(1000);
  });
});

describe("Login Page - Invalid Credentials", () => {
  beforeEach(() => {
    cy.visit(`${baseURL}/?`);
  });

  it("should display an error for invalid credentials", () => {
    const invalidEmail = "invalid@sbu.com"; 
    const invalidPassword = "wrongpassword";

    cy.get("#email").type(invalidEmail);
    cy.get("#password").type(invalidPassword);
    cy.get("#submit_button").click();
    cy.slowCommand(1000);
  });
});

