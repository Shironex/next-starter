export const APP_TITLE = 'WriterWiz'
export const EMAIL_SENDER = '"Writewiz" <noreply@writewiz.shirone.xyz>'
export const GITHUB_AVATARS_URL = 'https://avatars.githubusercontent.com/u/'
export const GOOGLE_AVATARS_URL = 'https://lh3.googleusercontent.com/a/'

export const redirects = {
  toLogin: '/sign-in',
  toSignup: '/sign-up',
  toForgotPassword: '/forgot-password',
  afterLogin: '/dashboard',
  afterLogout: '/',
  toVerify: '/verify-email',
  toUnauthorized: '/unauthorized',
} as const
