/* eslint-disable @typescript-eslint/no-unused-expressions */
/// <reference types="cypress" />
import 'cypress-v10-preserve-cookie'

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-cy*=${selector}]`, ...args)
})

Cypress.Commands.add('getDataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('interceptRequest', (method: string) => {
  cy.intercept({ method, path: '/api/employees' }, (req) => {
    req.alias = method
  })
})

Cypress.Commands.add('eqUrl', (path: string) => {
  return cy.url().should('eq', `${Cypress.config().baseUrl}/${path}`)
})

Cypress.Commands.add(
  'checkErrorMessage',
  (dataCy: string, expectedText: string) => {
    cy.getDataCy(dataCy).should('be.visible')
    cy.getDataCy(dataCy).should('have.text', expectedText)
  }
)

Cypress.Commands.add('typeInput', (dataCy, text) => {
  cy.getDataCy(dataCy).type(text)
})

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/sign-in')
      cy.getAllCookies().should('be.empty')
      cy.typeInput('email-input', email)
      cy.typeInput('password-input', password)

      cy.getDataCy('sign-in-btn').click()

      cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
    },
    {
      validate() {
        cy.request({
          method: 'GET',
          url: '/api/user/me',
        }).then(({ body }) => {
          expect(body.user).to.have.property('email', email)
        })
      },
    }
  )
})

Cypress.Commands.add(
  'register',
  (email: string, password: string, firstName: string, lastName: string) => {
    cy.getAllCookies().should('be.empty')

    cy.typeInput('email-input', email)
    cy.typeInput('password-input', password)
    cy.typeInput('first-name-input', firstName)
    cy.typeInput('last-name-input', lastName)

    cy.getDataCy('sign-up-btn').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/verify-email`)

    // Get the verification code from the database

    cy.task('getVerificationCode', email).then((code: string | null) => {
      expect(code).to.not.be.null

      // Type the code into the OTP input field
      cy.typeInput('otp-input', code as string)

      // Click the verify button
      cy.getDataCy('verify-btn').click()

      cy.wait(3000)
      // Assert that the URL changes to the dashboard after verification
      cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
    })
  }
)

Cypress.Commands.add('logout', () => {
  cy.getDataCy('btn-user-dropdown').click()

  cy.getDataCy('logout-btn').click()

  cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`)

  cy.getCookie('session').should('not.exist')
})
