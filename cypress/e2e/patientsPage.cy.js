// const baseURL = "http://localhost:3000";
const baseURL = "https://yunjiaapp-c337d89ea438.herokuapp.com";

describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit(`${baseURL}/?`);
  });
});

Cypress.Commands.add("slowCommand", (ms = 1000) => {
  cy.wait(ms);
});

describe("Hospital Admin Login and Patient Search", () => {
  it("should log in and perform various searches and pagination", () => {
    cy.visit(`${baseURL}/?`);
    cy.get("#email").type("hospitaladmin@gmail.c");
    cy.get("#password").type("1234567890");
    cy.get("#submit_button").click();
    cy.slowCommand(1000);

    // Navigate to the Patients page
    cy.get("#logo").click();
    cy.slowCommand(2000);
    cy.contains("Patients").click();
    cy.slowCommand(2000);

    // Search by Name
    cy.get("#search").clear().type("John");
    cy.slowCommand(1000);

    // Search by Gender
    cy.get("#search").clear().type("Female");
    cy.slowCommand(1000);

    // Search by Assigned Doctor
    cy.get("#search").clear().type("Linda");
    cy.slowCommand(1000);

    // Search by Status
    cy.get("#search").clear().type("Emergency");
    cy.slowCommand(1000);
  });
});
