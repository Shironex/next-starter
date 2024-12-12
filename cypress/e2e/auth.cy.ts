/* eslint-disable @typescript-eslint/no-unused-expressions */
/// <reference types="cypress" />
import {
  notVerifiedUser,
  userForRegister,
  verifiedUser,
} from '../fixtures/auth.json'

const EMAIL_ERROR = 'Please enter a valid email'
const PASSWORD_SHORT_ERROR = 'Password is too short.'
const PASSWORD_LONG_ERROR = 'Password can be at most 32 characters long.'
const FIRST_NAME_SHORT_ERROR = 'First name is too short.'
const FIRST_NAME_LONG_ERROR = 'First name is too long.'
const LAST_NAME_SHORT_ERROR = 'Last name is too short.'
const LAST_NAME_LONG_ERROR = 'Last name is too long.'

context('Auth', () => {
  before(() => {
    cy.task('tearDownDataBase')
    cy.task('seedDatabase')
  })

  describe('Register', () => {
    beforeEach(() => {
      cy.getAllCookies().should('be.empty')
      cy.visit('/sign-up')
    })

    it('should throw form error when email is invalid', () => {
      cy.typeInput('email-input', 'test')
      cy.checkErrorMessage('error-message-email', EMAIL_ERROR)
    })

    describe('should throw form error when password is invalid', () => {
      it('too short', () => {
        cy.typeInput('password-input', 'test')
        cy.checkErrorMessage('error-message-password', PASSWORD_SHORT_ERROR)
      })

      it('too long', () => {
        cy.typeInput('password-input', 't'.repeat(33))
        cy.checkErrorMessage('error-message-password', PASSWORD_LONG_ERROR)
      })
    })

    describe('should throw form error when username is invalid', () => {
      it('First Name too short', () => {
        cy.typeInput('first-name-input', 'tt')
        cy.checkErrorMessage('error-message-first-name', FIRST_NAME_SHORT_ERROR)
      })

      it('First Name too long', () => {
        cy.typeInput('first-name-input', 't'.repeat(33))
        cy.checkErrorMessage('error-message-first-name', FIRST_NAME_LONG_ERROR)
      })

      it('Last Name too short', () => {
        cy.typeInput('last-name-input', 'tt')
        cy.checkErrorMessage('error-message-last-name', LAST_NAME_SHORT_ERROR)
      })

      it('Last Name too long', () => {
        cy.typeInput('last-name-input', 't'.repeat(33))
        cy.checkErrorMessage('error-message-last-name', LAST_NAME_LONG_ERROR)
      })
    })

    it('should register user successfully', () => {
      cy.register(
        userForRegister.email,
        userForRegister.password,
        userForRegister.first_name,
        userForRegister.last_name
      )
    })
  })

  describe('Login', () => {
    beforeEach(() => {
      cy.getAllCookies().should('be.empty')
      cy.visit('/sign-in')
    })

    it('should throw form error when email is invalid', () => {
      cy.typeInput('email-input', 'test')
      cy.checkErrorMessage('error-message-email', EMAIL_ERROR)
    })

    describe('should throw form error when password is invalid', () => {
      it('too short', () => {
        cy.typeInput('password-input', 'test')
        cy.checkErrorMessage('error-message-password', PASSWORD_SHORT_ERROR)
      })

      it('too long', () => {
        cy.typeInput('password-input', 't'.repeat(33))
        cy.checkErrorMessage('error-message-password', PASSWORD_LONG_ERROR)
      })
    })

    it('should login user successfully', () => {
      cy.login(verifiedUser.email, verifiedUser.password)
    })
  })

  describe('Forgot Password', () => {
    beforeEach(() => {
      cy.getAllCookies().should('be.empty')
      cy.visit('/sign-in')
      cy.getDataCy('forgot-password-link').click()

      cy.url().should('eq', `${Cypress.config().baseUrl}/forgot-password`)
    })

    it('should throw form error when email is invalid', () => {
      cy.typeInput('email-input', 'test')
      cy.checkErrorMessage('error-message-email', EMAIL_ERROR)
    })

    it('should throw form error when email is not found', () => {
      cy.typeInput('email-input', 'writewiz@gmail.com')
      cy.getDataCy('reset-password-btn').click()

      cy.contains('li', 'User with this email was not found.')
    })

    it('should throw form error when email is not verified', () => {
      cy.typeInput('email-input', notVerifiedUser.email)
      cy.getDataCy('reset-password-btn').click()

      cy.contains(
        'li',
        'Your email is not verified. Please verify your email first.'
      )
    })

    it('should user be able to request password reset successfully', () => {
      cy.typeInput('email-input', verifiedUser.email)
      cy.getDataCy('reset-password-btn').click()

      cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`)

      cy.contains('li', 'A password reset link has been sent to your email.')

      //? Wait for the email to arrive and extract the reset password link
      cy.task('getPasswordResetToken', verifiedUser.email).then((token) => {
        expect(token).to.not.be.null

        cy.visit(`/forgot-password/${token}`)

        cy.url().should(
          'contain',
          `${Cypress.config().baseUrl}/forgot-password`
        )

        cy.typeInput('password-input', verifiedUser.password)
        cy.getDataCy('confirm-password-btn').click()

        cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`)

        cy.contains('li', 'Password reset successfully')
      })
    })
  })

  describe('Logout', () => {
    it('should user be able to logout successfully', () => {
      cy.login(verifiedUser.email, verifiedUser.password)

      cy.visit(`${Cypress.config().baseUrl}/dashboard`)

      cy.logout()
    })
  })
})
