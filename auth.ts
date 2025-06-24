import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import { SignInSchema } from './schema'
import bcrypt from 'bcrypt'
import { db, users } from "./schema/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"

// Custom error for better error handling
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
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

          // Query user from database
          const userResult = await db
            .select()
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
    // Session callback to add user id to session
    session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  // Security configuration
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
})