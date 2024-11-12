import { type TransportOptions, createTransport } from 'nodemailer'

import { EMAIL_SENDER } from '@/lib/constants'

import { env } from '@/env/server'

const smtpConfig = {
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
}

const transporter = createTransport(smtpConfig as TransportOptions)

export type MessageInfo = {
  to: string
  subject: string
  body: string
}

export const sendMail = async (message: MessageInfo) => {
  if (process.env.cypress_test) return // Skip sending email in test environment (Cypress)

  transporter.verify((error) => {
    if (error) {
      console.error('Error connecting to transporter:', error)
      throw new Error('Error connecting to transporter')
    }
  })

  const { to, subject, body } = message

  const mailOptions = {
    from: EMAIL_SENDER,
    to,
    subject,
    html: body,
  }

  return await transporter.sendMail(mailOptions)
}
