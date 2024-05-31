// const baseURL = "http://localhost:3000";
const baseURL = 'https://yunjiaapp-c337d89ea438.herokuapp.com';

describe("Forgot Password", () => {
  beforeEach(() => {
    cy.visit(`${baseURL}`);
  });

  Cypress.Commands.add("slowCommand", (ms = 1000) => {
    cy.wait(ms);
  });

  it("navigate to the forget password page", () => {
    cy.get("#forget_password_button").click();
    cy.url().should("include", "/forgetpassword"); 
    cy.wait(1000);
  });

  it("Invalid Email", () => {
    cy.get("#forget_password_button").click();
    const invalidEmail = "invalid-email";
    cy.get('input[name="email"]').type(invalidEmail);
    cy.get('button[type="submit"]').click();
    cy.contains("Please enter a valid email").should("be.visible"); 
    cy.wait(1000);
  });

  it("Email is empty", () => {
    cy.get("#forget_password_button").click();
    cy.get('button[type="submit"]').click();

    cy.contains("Please provide email").should("be.visible");
    cy.wait(1000);
  });

  it("Email with invalid format", () => {
    cy.get("#forget_password_button").click();
    const invalidEmail = "invalid-email";
    cy.get('input[name="email"]').type(invalidEmail);
    cy.get('button[type="submit"]').click();
    cy.contains("Please enter a valid email address").should("be.visible");
    cy.wait(1000);
  });

  it("return to login page", () => {
    cy.get("#forget_password_button").click();
    cy.get("#return_to_login_button").click();
    cy.url().should("include", "/");
    cy.wait(1000);
  });
});
