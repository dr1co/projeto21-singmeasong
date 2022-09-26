describe("Tests if it's possible to navigate to top recommendations page", () => {
    it("Visits top page", () => {
        cy.visit("http://localhost:3000/");
        cy.intercept("GET", "/recommendations/top/10").as("getTopRecommendations");

        cy.get("div").contains("Top").click();

        cy.wait("@getTopRecommendations");

        cy.url().should("equal", "http://localhost:3000/top");
        cy.get("article").should("have.length.lessThan", 11);
    });
});

describe("Tests if it's possible to navigate back to homepage", () => {
    it("Goes back to homepage", () => {
        cy.get("div").contains("Home").click();

        cy.url().should("equal", "http://localhost:3000/");
    });
});