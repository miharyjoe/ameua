import ForgotPasswordForm from '@/components/forgot-password-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password - AMEUA',
  description: 'Reset your password for AMEUA',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
} 