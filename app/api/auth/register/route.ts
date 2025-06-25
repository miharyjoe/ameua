import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db, users } from '@/schema/schema'
import { SignUpSchema } from '@/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = SignUpSchema.parse(body)
    const { name, email, password } = validatedData

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password with bcrypt (salt rounds: 12)
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user in database
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        image: null,
        role: 'user', // Default role
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
      })

    if (!newUser || newUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Return user data (without password)
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      )
    }

    // Handle database errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 