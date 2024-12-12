/// <reference types="cypress" />
import { secondVerifiedUser, verifiedUser } from '../fixtures/auth.json'

const EMAIL_ERROR = 'Please enter a valid email'
const EMAIL_SAME_ERROR = 'The new email cannot be the same as the current email'
const EMAIL_TAKEN_ERROR = 'This email is already taken. Please use other one.'
const EMAIL_SUCCESS = 'Email updated successfully'
const PASSWORD_SHORT_ERROR = 'Password must be at least 6 characters'
const PASSWORD_LONG_ERROR = 'Password can be at most 32 characters long'
const PASSWORD_SAME_ERROR =
  'The new password cannot be the same as the current password'
const PASSWORD_SUCCESS = 'Password updated successfully'

context('Settings', () => {
  before(() => {
    cy.task('tearDownDataBase')
    cy.task('seedDatabase')
  })

  beforeEach(() => {
    cy.login(verifiedUser.email, verifiedUser.password)
    cy.visit('/settings')
  })

  const updateEmail = (email: string) => {
    cy.getDataCy('email-input').clear().type(email)
    cy.getDataCy('btn-submit-email-update').click()
  }

  const updatePassword = (currentPassword: string, newPassword: string) => {
    cy.getDataCy('input-current-password').clear().type(currentPassword)
    cy.getDataCy('input-new-password').clear().type(newPassword)
    cy.getDataCy('btn-submit-password-update').click()
  }

  describe('should be able to update email', () => {
    it('should throw form error when email is invalid', () => {
      updateEmail('test')
      cy.getDataCy('error-message-email')
        .should('be.visible')
        .and('have.text', EMAIL_ERROR)
    })

    it('should throw form error when email is the same as the current email', () => {
      updateEmail(verifiedUser.email)
      cy.contains('li', EMAIL_SAME_ERROR)
    })

    it('should throw form error when email is already taken', () => {
      updateEmail(secondVerifiedUser.email)
      cy.contains('li', EMAIL_TAKEN_ERROR)
    })

    it('should update email', () => {
      const newEmail = 'testemail@gmail.com'
      updateEmail(newEmail)
      cy.contains('li', EMAIL_SUCCESS)

      // Check if email is also updated in the dropdown menu
      cy.getDataCy('btn-user-dropdown').click()
      cy.getDataCy('user-email').should('have.text', newEmail)

      // Revert the email back to the original email
      cy.visit('/settings')
      updateEmail(verifiedUser.email)
      cy.contains('li', EMAIL_SUCCESS)

      // Check if email is also updated in the dropdown menu
      cy.getDataCy('btn-user-dropdown').click()
      cy.getDataCy('user-email').should('have.text', verifiedUser.email)
    })

    //TODO: Add test for email verification when email is updated
  })

  describe('should be able to update password', () => {
    it('should throw form error when password is too short', () => {
      updatePassword('test', 'test')
      cy.getDataCy('error-message-current-password')
        .should('be.visible')
        .and('have.text', PASSWORD_SHORT_ERROR)
      cy.getDataCy('error-message-new-password')
        .should('be.visible')
        .and('have.text', PASSWORD_SHORT_ERROR)
    })

    it('should throw form error when password is too long', () => {
      const longPassword = 't'.repeat(35)
      updatePassword(longPassword, longPassword)
      cy.getDataCy('error-message-current-password')
        .should('be.visible')
        .and('have.text', PASSWORD_LONG_ERROR)
      cy.getDataCy('error-message-new-password')
        .should('be.visible')
        .and('have.text', PASSWORD_LONG_ERROR)
    })

    it('should throw form error when password is the same as the current password', () => {
      updatePassword(verifiedUser.password, verifiedUser.password)
      cy.contains('li', PASSWORD_SAME_ERROR)
    })

    it('should update password', () => {
      const newPassword = 'newpassword123'
      updatePassword(verifiedUser.password, newPassword)
      cy.contains('li', PASSWORD_SUCCESS)

      // Revert the password back to the original password
      updatePassword(newPassword, verifiedUser.password)
      cy.contains('li', PASSWORD_SUCCESS)
    })
  })
})
