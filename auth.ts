import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import Credentials from 'next-auth/providers/credentials'
import { SignInSchema } from './schema'
import bcrypt from 'bcrypt'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = await SignInSchema.parseAsync(credentials)

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (!user) {
          throw new Error('No user found')
        }

        const isValid = bcrypt.compareSync(password, user.password!)

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
})