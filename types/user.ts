export interface User {
  id: string
  name: string
  email: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateUser {
  name: string
  email: string
  password: string
  image?: string
}

export interface UserSession {
  id: string
  name: string
  email: string
  image?: string
} 