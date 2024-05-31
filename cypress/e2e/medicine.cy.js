describe("Add New Medication Test", () => {
  it("should click Add New Medication and fill out the form", () => {
    // Visit the page
    cy.visit(
      "https://yunjiaapp-c337d89ea438.herokuapp.com/patientInfo/6621fc5e48fc87b294c24173"
    );

    // Click the "Add New Medication" button
    cy.contains("Add New Medication").click();

    // Fill out the Medication Name
    cy.get('input[name="name"]').type("Ibuprofen");

    // Fill out the Dosage
    cy.get('input[name="dosage"]').type("3");

    // Fill out the Duration
    cy.get('input[name="duration"]').type("8");

    // Fill out the Date
    cy.get('input[name="date"]').type("2024-05-20");

    // Click the "Save" button
    cy.contains("Save").click();

    cy.wait(1000);

    // Find the row with the medication name and click the delete button within that row
    cy.contains("td", "Ibuprofen")
      .parent("tr")
      .within(() => {
        cy.get('svg[data-testid="DeleteIcon"]').click();
      });
  });
});
