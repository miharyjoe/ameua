import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import { SignInSchema, UserRoleType } from './schema'
import bcrypt from 'bcrypt'
import { db, users } from "./schema/schema"
import { eq } from "drizzle-orm"

// Custom error for better error handling
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Remove DrizzleAdapter for faster JWT-only sessions
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    Credentials({
      // The name to display on the sign in form
      name: "credentials",
      // The credentials object defines the input fields
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "user@example.com" 
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "••••••••" 
        },
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials using Zod schema
          const { email, password } = await SignInSchema.parseAsync(credentials)

          // Query user from database with optimized query
          const userResult = await db
            .select({
              id: users.id,
              name: users.name,
              email: users.email,
              password: users.password,
              image: users.image,
              role: users.role,
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

          // Check if user exists
          if (!userResult || userResult.length === 0) {
            throw new InvalidLoginError()
          }

          const user = userResult[0]

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            throw new InvalidLoginError()
          }

          // Return user object (don't include password)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role as UserRoleType,
          }
        } catch (error) {
          // Handle validation errors and authentication errors
          if (error instanceof InvalidLoginError) {
            throw error
          }
          // For any other error (including Zod validation), throw generic error
          throw new InvalidLoginError()
        }
      },
    }),
  ],
  callbacks: {
    // Optimized JWT callback
    jwt({ token, user }) {
      if (user) {
        // Store user data in JWT token (encrypted)
        token.id = user.id
        token.role = user.role
        token.name = user.name
        token.email = user.email
        token.image = user.image
      }
      return token
    },
    // Optimized session callback - no database queries
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRoleType
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  // Optimized security configuration
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  // Add JWT secret for faster token verification
  secret: process.env.NEXTAUTH_SECRET,
})