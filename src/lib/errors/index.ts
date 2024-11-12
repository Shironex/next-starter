export class PublicError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super('You must be logged in to perform this action')
    this.name = 'AuthenticationError'
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super('Email is already in use')
    this.name = 'EmailInUseError'
  }
}

export class UserNotFoundError extends PublicError {
  constructor() {
    super('User not found')
    this.name = 'UserNotFoundError'
  }
}

export class NotFoundError extends PublicError {
  constructor() {
    super('Resource not found')
    this.name = 'NotFoundError'
  }
}

export class TokenExpiredError extends PublicError {
  constructor() {
    super('Token has expired')
    this.name = 'TokenExpiredError'
  }
}

export class LoginError extends PublicError {
  constructor() {
    super('Invalid email or password')
    this.name = 'LoginError'
  }
}

export class RateLimitError extends PublicError {
  constructor() {
    super('Too many attempts. Please try again later.')
    this.name = 'RateLimitError'
  }
}
