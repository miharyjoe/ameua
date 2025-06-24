import { NextRequest, NextResponse } from 'next/server'
import { db, users, verificationTokens } from '@/schema/schema'
import { ResetPasswordSchema } from '@/schema'
import { eq, and } from 'drizzle-orm'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const result = ResetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      )
    }

    const { token, password } = result.data

    // Find the verification token
    const tokenResult = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .limit(1)

    if (!tokenResult || tokenResult.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    const verificationToken = tokenResult[0]

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, token))

      return NextResponse.json(
        { error: 'Token has expired. Please request a new password reset.' },
        { status: 400 }
      )
    }

    // Find user by email (identifier)
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, verificationToken.identifier))
      .limit(1)

    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      )
    }

    const user = userResult[0]

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user's password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id))

    // Delete the used token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token))

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
} 