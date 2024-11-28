/// <reference types="cypress" />
import {
  notVerifiedUser,
  userForRegister,
  verifiedUser,
} from '../fixtures/auth.json'

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
      cy.getDataCy('email-input').type('test')
      cy.getDataCy('error-message-email').should('be.visible')
      cy.getDataCy('error-message-email').should(
        'have.text',
        'Please enter a valid email'
      )
    })

    describe('should throw form error when password is invalid', () => {
      it('too short', () => {
        cy.getDataCy('password-input').type('test')
        cy.getDataCy('error-message-password').should('be.visible')
        cy.getDataCy('error-message-password').should(
          'have.text',
          'Password is too short.'
        )
      })

      it('too long', () => {
        cy.getDataCy('password-input').type('t'.repeat(33))
        cy.getDataCy('error-message-password').should('be.visible')
        cy.getDataCy('error-message-password').should(
          'have.text',
          'Password can be at most 32 characters long.'
        )
      })
    })

    describe('should throw form error when username is invalid', () => {
      it('First Name too short', () => {
        cy.getDataCy('first-name-input').type('tt')
        cy.getDataCy('error-message-first-name').should('be.visible')
        cy.getDataCy('error-message-first-name').should(
          'have.text',
          'First name is too short.'
        )
      })

      it('First Name too long', () => {
        cy.getDataCy('first-name-input').type('t'.repeat(33))
        cy.getDataCy('error-message-first-name').should('be.visible')
        cy.getDataCy('error-message-first-name').should(
          'have.text',
          'First name is too long.'
        )
      })

      it('Last Name too short', () => {
        cy.getDataCy('last-name-input').type('tt')
        cy.getDataCy('error-message-last-name').should('be.visible')
        cy.getDataCy('error-message-last-name').should(
          'have.text',
          'Last name is too short.'
        )
      })

      it('Last Name too long', () => {
        cy.getDataCy('last-name-input').type('t'.repeat(33))
        cy.getDataCy('error-message-last-name').should('be.visible')
        cy.getDataCy('error-message-last-name').should(
          'have.text',
          'Last name is too long.'
        )
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
      cy.getDataCy('email-input').type('test')
      cy.getDataCy('error-message-email').should('be.visible')
      cy.getDataCy('error-message-email').should(
        'have.text',
        'Please enter a valid email'
      )
    })

    describe('should throw form error when password is invalid', () => {
      it('too short', () => {
        cy.getDataCy('password-input').type('test')
        cy.getDataCy('error-message-password').should('be.visible')
        cy.getDataCy('error-message-password').should(
          'have.text',
          'Password is too short.'
        )
      })

      it('too long', () => {
        cy.getDataCy('password-input').type('t'.repeat(33))
        cy.getDataCy('error-message-password').should('be.visible')
        cy.getDataCy('error-message-password').should(
          'have.text',
          'Password can be at most 32 characters long.'
        )
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
      cy.getDataCy('email-input').type('test')
      cy.getDataCy('error-message-email').should('be.visible')
      cy.getDataCy('error-message-email').should(
        'have.text',
        'Please enter a valid email'
      )
    })

    it('should throw form error when email is not found', () => {
      cy.getDataCy('email-input').type('writewiz@gmail.com')
      cy.getDataCy('reset-password-btn').click()
      cy.contains('li', 'User with this email was not found.')
    })

    it('should throw form error when email is not verified', () => {
      cy.getDataCy('email-input').type(notVerifiedUser.email)
      cy.getDataCy('reset-password-btn').click()
      cy.contains(
        'li',
        'Your email is not verified. Please verify your email first.'
      )
    })

    it('should user be able to request password reset successfully', () => {
      cy.getDataCy('email-input').type(verifiedUser.email)
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

        cy.getDataCy('password-input').type(verifiedUser.password)
        cy.getDataCy('confirm-password-btn').click()

        cy.url().should('eq', `${Cypress.config().baseUrl}/sign-in`)

        cy.contains('li', 'Password reset successfully')
      })
    })
  })

  // describe('Logout', () => {
  //   it('should user be able to logout successfully', () => {
  //     cy.login(verifiedUser.email, verifiedUser.password)
  //     cy.visit(`${Cypress.config().baseUrl}/projects`)
  //     cy.logout()
  //   })
  // })
})
