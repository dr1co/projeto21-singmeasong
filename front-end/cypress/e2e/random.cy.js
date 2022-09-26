describe("Tests if it's possible to navigate to random recommendation page", () => {
    it("Visits random page", () => {
        cy.visit("http://localhost:3000/");
        cy.intercept("GET", "/recommendations/random").as("getRandomRecommendation");

        cy.get("div").contains("Random").click();

        cy.wait("@getRandomRecommendation");

        cy.url().should("equal", "http://localhost:3000/random");
        cy.get("article").should("have.length", 1);
    });
});

describe("Tests if it's possible to navigate back to homepage", () => {
    it("Goes back to homepage", () => {
        cy.get("div").contains("Home").click();

        cy.url().should("equal", "http://localhost:3000/");
    });
});