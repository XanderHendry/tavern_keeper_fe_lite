import { aliasQuery, aliasMutation, hasOperationName } from "../utils/graphql-test-utils";

context('Functional Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://tavern-keeper-be.onrender.com/graphql/', (req) => {
      // Queries
      aliasQuery(req, 'getEncounters');
      aliasQuery(req, 'getEncounter');
      aliasQuery(req, 'getMonsters');
      aliasQuery(req, 'getMonster');

      // Mutations
      aliasMutation(req, 'createEncounter');

      // Check if it's a getEncounters query
      if (hasOperationName(req, 'getEncounters')) {
        // Check scenario and set appropriate fixture
        if (req.body.variables.userName === 'demo-no-encounters') {
          req.alias = 'gqlGetEncountersQueryNoEncounters';
          req.reply({ fixture: 'mock_data_getEncounters_none.json' });
        } else if (req.body.variables.userName === 'demo-one-encounter') {
          req.alias = 'gqlGetEncountersQueryOneEncounter';
          req.reply({ fixture: 'mock_data_getEncounters_one.json' });
        } else {
          req.alias = 'gqlGetEncountersQueryManyEncounters';
          req.reply({ fixture: 'mock_data_getEncounters_many.json' });
        }
      }
    });
  });

  it('should render elements correctly on login page', () => {
    cy.visit('/login');
    cy.get('.app-title').contains('Tavern Keeper');
    cy.get('.greeting').contains('Welcome Traveler...');
    cy.get('.login-container').children().should('have.length', 3);
    cy.get('.login-button').first().contains('DEMO - No Encounters');
    cy.get('.login-button').eq(1).contains('DEMO - One Encounter');
    cy.get('.login-button').last().contains('DEMO - Many Encounters');
  });

  it('should render header elements correctly on home page when logging in', () => {
    cy.visit('/login');
    cy.get('.login-button').contains('DEMO - No Encounters').click();
    cy.wait('@gqlGetEncountersQueryNoEncounters')
      .its('response.body.data.encounters')
      .should((encounters) => {
        expect(encounters.length).to.equal(0);
      });
    cy.get('.app-title').contains('Tavern Keeper');
    cy.get('.home-button').should('have.attr', 'href', '/');
    cy.get('.EncounterBuilderButton').contains('Build New Encounter');
    cy.get('.build-new-encounter-link').should('have.attr', 'href', '/encounterbuilder');
    cy.get('.LogoutButton').contains('Logout');
    cy.get('.logout-link').should('have.attr', 'href', '/login');
  });

  it('should render expected elements correctly on home page when logging in as DEMO - No Encounters', () => {
    cy.visit('/login');
    cy.get('.login-button').contains('DEMO - No Encounters').click();
    cy.wait('@gqlGetEncountersQueryNoEncounters')
      .its('response.body.data.encounters')
      .should((encounters) => {
        expect(encounters.length).to.equal(0);
      });
  });

  it('should render expected elements correctly on home page when logging in as DEMO - One Encounter', () => {
    cy.visit('/login');
    cy.get('.login-button').contains('DEMO - One Encounter').click();
    cy.wait('@gqlGetEncountersQueryOneEncounter')
      .its('response.body.data.encounters')
      .should((encounters) => {
        expect(encounters.length).to.equal(1);
      });
    cy.get('.EncounterPreviewContainer').children().should('have.length', 1);
    cy.get('.EncounterPreviewCard').first().within(() => {
      cy.get('.preview-encounter-name').contains("We each need to find our own inspiration, Kiki. Sometimes it's not easy.");
      cy.get('.preview-section-title').contains('Encounter Summary');
      cy.get('.preview-encounter-summary').contains('The world was young, the mountains green');
      cy.get('.preview-section-title').contains('Monster(s)');
      cy.get('.preview-monster-list').children().first().contains('Kobold');
      cy.get('.preview-monster-list').children().eq(1).contains('Kobold');
      cy.get('.preview-monster-list').children().last().contains('Ancient Red Dragon');
      cy.get('.preview-party-size').within(() => {
        cy.get('.preview-section-title').contains('Party Size');
        cy.get('.preview-party-size-value').contains('2');
      });
      cy.get('.preview-party-level').within(() => {
        cy.get('.preview-section-title').contains('Party Level');
        cy.get('.preview-party-level-value').contains('12');
      });
    });
    cy.get('.EncounterPreviewCard').last().within(() => {
      cy.get('.preview-encounter-name').contains("We each need to find our own inspiration, Kiki. Sometimes it's not easy.");
      cy.get('.preview-section-title').contains('Encounter Summary');
      cy.get('.preview-encounter-summary').contains('The world was young, the mountains green');
      cy.get('.preview-section-title').contains('Monster(s)');
      cy.get('.preview-monster-list').children().first().contains('Kobold');
      cy.get('.preview-monster-list').children().eq(1).contains('Kobold');
      cy.get('.preview-monster-list').children().last().contains('Ancient Red Dragon');
      cy.get('.preview-party-size').within(() => {
        cy.get('.preview-section-title').contains('Party Size');
        cy.get('.preview-party-size-value').contains('2');
      });
      cy.get('.preview-party-level').within(() => {
        cy.get('.preview-section-title').contains('Party Level');
        cy.get('.preview-party-level-value').contains('12');
      });
    });
  });

  it.skip('should render expected elements correctly on home page when logging in as DEMO - Many Encounters', () => {

  });

});