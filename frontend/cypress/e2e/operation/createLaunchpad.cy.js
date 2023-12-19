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
        cy.viewport(1600, 900)
    })
    let address = ""
    it('displays two todo items by default', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        cy.wait(5000)
        cy.get('.sub-connect').click().then(() => {
            cy.wait(1000)
            cy.get('.connect-item:first').click()
        }).then(() => {
            cy.wait(1000)
            cy.get('.mongobox-header .nav-box ul li:first .w-font').click()
        }).then(() => {
            cy.wait(1000)
            cy.get('.mongobox-header .nav-box ul li:first .w-font .nav-list .nav-item:nth-child(1)').click()
        }).then(() => {
            cy.wait(5000)
            cy.get('.token .row').eq(0).find('.btn').click()
            cy.get('.token .row').eq(0).find('.address').invoke('text').then(text => {
                console.log(text);
                address = text
                cy.wait(1000)
                cy.get('.mongobox-header ul li').eq(1).click()

            })
        }).then(() => {
            cy.wait(1000)
            cy.get('.mongobox-header .nav-box ul li:last .w-font').click()
        }).then(() => {
            cy.wait(1000)
            cy.get('.mongobox-header .nav-box ul li:last .w-font .nav-list .nav-item:nth-child(1)').click()
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part:first input').type(address)
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(1).find('input').type(address)
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(2).find('input').type(address)
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(3).find('input').type('100')
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(4).find('input').type('1000')
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(5).find('input').type('10000')
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(6).find('input').type('10')
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(7).find('input').type('100')
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(8).find('input').click()
                .get('.ant-calendar-cell:first').click().get('.ant-calendar-ok-btn').click()
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .input-part').eq(9).find('input').click()
                .get('.ant-calendar-cell:last').click().get('.ant-calendar-ok-btn').click()
        }).then(() => {
            cy.wait(1000)
            cy.get('.CreateLaunchpads .create-panel:first').find('.next-btn').click()
        })
        .then(() => {
            cy.wait(1000)
            cy.get('.part2 .input-part:first input').type('TestLaunchpad')
        })
        .then(() => {
            cy.wait(1000)
            cy.get('.part2').find('.finish-btn').click()
        })

        .then(() => {
            cy.wait(1000)
            cy.get('.part3').find('.submit-btn').click()
        })
    })
})
