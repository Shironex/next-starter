/// <reference types="cypress" />
import 'cypress-v10-preserve-cookie'

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-cy*=${selector}]`, ...args)
})

Cypress.Commands.add('getDataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('interceptRequest', (method) => {
  cy.intercept({ method, path: '/api/employees' }, (req) => {
    req.alias = method
  })
})

Cypress.Commands.add('eqUrl', (path) => {
  return cy.url().should('eq', `${Cypress.config().baseUrl}/${path}`)
})

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/sign-in')
      cy.getAllCookies().should('be.empty')
      cy.getDataCy('email-input').type(email)
      cy.getDataCy('password-input').type(password)

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
    cy.getDataCy('email-input').type(email)
    cy.getDataCy('password-input').type(password)
    cy.getDataCy('first-name-input').type(firstName)
    cy.getDataCy('last-name-input').type(lastName)

    cy.getDataCy('sign-up-btn').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/verify-email`)

    // Get the verification code from the database

    cy.task('getVerificationCode', email).then((code) => {
      expect(code).to.not.be.null

      // Type the code into the OTP input field
      cy.getDataCy('otp-input').type(code as string)

      // Click the verify button
      cy.getDataCy('verify-btn').click()

      cy.wait(3000)
      // Assert that the URL changes to the dashboard after verification
      cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
    })
  }
)

Cypress.Commands.add('logout', () => {
  cy.getDataCy('profile-btn').click()
  cy.getDataCy('logout-btn').click()
  cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`)
  cy.getCookie('session').should('not.exist')
})
