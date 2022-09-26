describe('Tests inserting new Recommendations', () => {
  it('Inserts new recommendation', () => {
    cy.resetDatabase();

    cy.visit('http://localhost:3000/');
    cy.intercept("POST", "/recommendations").as("postRecommendations");

    cy.get("input[placeholder='Name'").type("A random Name");
    cy.get("input[placeholder='https://youtu.be/...'").type("https://www.youtube.com/watch?v=lB4PRX737-0");
    cy.get("button").click();

    cy.wait("@postRecommendations");

    cy.get("article").should('have.length', 1);
  });

  it('Fails on inserting recommendation with the same name', () => {
    cy.intercept("POST", "/recommendations").as("postRecommendations");

    cy.get("input[placeholder='Name'").type("A random Name");
    cy.get("input[placeholder='https://youtu.be/...'").type("https://www.youtube.com/watch?v=aYe-2Glruu4");
    cy.get("button").click();

    cy.wait("@postRecommendations");

    cy.get("article").should('have.length', 1);
  });

  it('Fails on inserting recommendation with no YouTube link', () => {
    cy.intercept("POST", "/recommendations").as("postRecommendations");

    cy.get("input[placeholder='Name'").type("Another Random Name");
    cy.get("input[placeholder='https://youtu.be/...'").type("https://www.google.com");
    cy.get("button").click();

    cy.wait("@postRecommendations");

    cy.get("article").should('have.length', 1);
  });
});

describe("Tests upvoting/downvoting recommendations", () => {
  it('Upvotes successfully a recommendation', () => {
    cy.intercept("POST", "/recommendations/1/upvote").as("upvote");

    cy.get("article").find("svg").first().click();

    cy.wait("@upvote");

    cy.get("article > div").should(($div) => {
      expect($div.eq(2)).to.contain("1");
    });
  });

  it('Downvotes successfully a recommendation', () => {
    cy.intercept("POST", "/recommendations/1/downvote").as("downvote");

    cy.get("article").find("svg").last().click();

    cy.wait("@downvote");

    cy.get("article > div").should(($div) => {
      expect($div.eq(2)).to.contain("0");
    });
  });
});
