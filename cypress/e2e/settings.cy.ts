/// <reference types="cypress" />
import { secondVerifiedUser, verifiedUser } from '../fixtures/auth.json'

context('Settings', () => {
  before(() => {
    cy.task('tearDownDataBase')
    cy.task('seedDatabase')
  })

  beforeEach(() => {
    cy.login(verifiedUser.email, verifiedUser.password)
    cy.visit('/settings')
  })

  describe('should be able to update email', () => {
    it('should throw form error when email is invalid', () => {
      cy.getDataCy('email-input').type('test')
      cy.getDataCy('error-message-email').should('be.visible')
      cy.getDataCy('error-message-email').should(
        'have.text',
        'Please enter a valid email'
      )
    })

    it('should throw form error when email is the same as the current email', () => {
      cy.getDataCy('email-input').clear().type(verifiedUser.email)
      cy.getDataCy('btn-submit').click()
      cy.contains('li', 'The new email cannot be the same as the current email')
    })

    it('should throw form error when email is already taken', () => {
      cy.getDataCy('email-input').clear().type(secondVerifiedUser.email)
      cy.getDataCy('btn-submit').click()
      cy.contains('li', 'This email is already taken. Please use other one.')
    })

    it('should update email', () => {
      const newEmail = 'testemail@gmail.com'

      cy.getDataCy('email-input').type(newEmail)
      cy.getDataCy('btn-submit').click()
      cy.contains('li', 'Email updated successfully')

      // Check if email is also updated in the dropdown menu
      cy.getDataCy('btn-user-dropdown').click()
      cy.getDataCy('user-email').should('have.text', newEmail)

      // Revert the email back to the original email
      cy.visit('/settings')

      cy.getDataCy('email-input').type(verifiedUser.email)
      cy.getDataCy('btn-submit').click()
      cy.contains('li', 'Email updated successfully')

      // Check if email is also updated in the dropdown menu
      cy.getDataCy('btn-user-dropdown').click()
      cy.getDataCy('user-email').should('have.text', verifiedUser.email)
    })

    //TODO: Add test for email verification when email is updated
  })
})
