import ResetPasswordForm from '@/components/reset-password-form'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Reset Password - AMEUA',
  description: 'Set a new password for your AMEUA account',
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams

  if (!token) {
    redirect('/auth/forgot-password')
  }

  return <ResetPasswordForm token={token} />
} 