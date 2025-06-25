import NextAuth, { DefaultSession } from "next-auth"
import { UserRoleType } from "@/schema"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRoleType
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRoleType
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRoleType
  }
} 