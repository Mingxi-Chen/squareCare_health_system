// const baseURL = "http://localhost:3000";
const baseURL = "https://yunjiaapp-c337d89ea438.herokuapp.com";

describe("System Admin", () => {
  Cypress.Commands.add("slowCommand", (ms = 1000) => {
    cy.wait(ms);
  });

  it("successfully filled the form", () => {
    cy.visit(`${baseURL}`);
    cy.get("#email").type("systemadmin@gmail.c");
    cy.get("#password").type("1234567890");
    cy.get("#submit_button").click();
    cy.slowCommand(1000);

    cy.get("#logo").click();
    cy.slowCommand(1000);

    cy.contains("Message").click();
    cy.slowCommand(1000);

    cy.get("#logo").click();
    cy.slowCommand(1000);

    cy.contains("Accounts").click();
    cy.slowCommand(1000);

    cy.get("#logo").click();
    cy.slowCommand(1000);

    cy.contains("Dashboard").click();
    cy.slowCommand(1000);

    cy.get("#logo").click();
    cy.slowCommand(1000);
    cy.contains("Logout").click();
  });
});

describe("Hospital Admin", () => {
  Cypress.Commands.add("slowCommand", (ms = 1000) => {
    cy.wait(ms);
  });

  it("successfully filled the form", () => {
    cy.visit(`${baseURL}`);
    cy.get("#email").type("hospitaladmin@gmail.c");
    cy.get("#password").type("1234567890");
    cy.get("#submit_button").click();
    cy.slowCommand(1000);

    cy.get("#logo").click();
    cy.slowCommand(1000);

    cy.contains("Patients").click();
    cy.slowCommand(1000);

    cy.get("#logo").click();
    cy.slowCommand(1000);

    cy.contains("Resources").click();
    cy.slowCommand(1000);

    cy.get("#logo").click();
    cy.slowCommand(1000);
    cy.contains("Logout").click();
  });
});
