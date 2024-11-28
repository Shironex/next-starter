/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getBySelLike(
      selector: string,
      ...args: any[]
    ): Chainable<JQuery<HTMLElement>>
    getDataCy(value: string): Chainable<JQuery<HTMLElement>>
    interceptRequest(method: string): void
    eqUrl(path: string): Chainable<string>
    login(email: string, password: string): void
    register(email: string, password: string, firstName: string, lastName): void
    logout(): void
  }
}
