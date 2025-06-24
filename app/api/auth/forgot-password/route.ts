import { NextRequest, NextResponse } from 'next/server'
import { db, users, verificationTokens } from '@/schema/schema'
import { ForgotPasswordSchema } from '@/schema'
import { eq } from 'drizzle-orm'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const result = ForgotPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Check if user exists
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    // Always return success message for security (don't reveal if email exists)
    const successResponse = NextResponse.json(
      { message: 'If an account with that email exists, we sent a password reset link.' },
      { status: 200 }
    )

    // If user doesn't exist, still return success message but don't send email
    if (!userResult || userResult.length === 0) {
      return successResponse
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await db.insert(verificationTokens).values({
      identifier: email,
      token: resetToken,
      expires,
    })

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken)

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      // Still return success to user for security, but log the error
    }

    return successResponse

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
} 