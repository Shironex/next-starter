/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  tearDownDataBase,
  seedDataBase,
  getPasswordResetToken,
  getVerificationCode,
  pruneCodes,
} from './task-helpers'

const tasks = (
  on: Cypress.PluginEvents,
  _config: Cypress.PluginConfigOptions
) => {
  on('task', {
    tearDownDataBase() {
      return tearDownDataBase()
    },
    seedDatabase() {
      return seedDataBase()
    },
    getPasswordResetToken(email: string) {
      return getPasswordResetToken(email)
    },
    getVerificationCode(email: string) {
      return getVerificationCode(email)
    },
    pruneCodes() {
      return pruneCodes()
    },
  })
}

export default tasks
