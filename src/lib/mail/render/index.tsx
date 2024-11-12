import { render } from '@react-email/render'

import VerificationCodeEmail, {
  VerificationCodeEmailProps,
} from '../templates/email-verification'
import ResetPasswordEmail, {
  ResetPasswordEmailProps,
} from '../templates/reset-password'

export function renderVerificationCodeEmail(data: VerificationCodeEmailProps) {
  return render(<VerificationCodeEmail code={data.code} />)
}

export function renderResetPasswordEmail(data: ResetPasswordEmailProps) {
  return render(<ResetPasswordEmail link={data.link} />)
}
