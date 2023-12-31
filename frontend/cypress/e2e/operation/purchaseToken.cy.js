/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress
describe('example to-do app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test

    // cy.task('createApiInstance').then(api => {
    //   // Use API instance to interact with a Polkadot node
    //   // ...
    //   console.log(api)
    //
    // })
    cy.visit('http://localhost:8080/')
    cy.viewport(1600,900)
  })

  it('displays two todo items by default', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.wait(5000)
    cy.get('.sub-connect').click().then(()=>{
      cy.wait(1000)
      cy.get('.connect-item:first').click()
    }).then(()=>{
      cy.wait(1000)
      cy.get('.list .list-item:first').click()
    }).then(()=>{
      cy.wait(1000)
      cy.get('.max-btn').click()
    }).then(()=>{
      cy.wait(1000)
      cy.get('.operate-btns .buy-btn').click()
    })


  })


})
