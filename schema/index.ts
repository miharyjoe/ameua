import * as zod from 'zod'

// User roles enum
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin'
} as const

export type UserRoleType = typeof UserRole[keyof typeof UserRole]

export const SignInSchema = zod.object({
  email: zod.string().email({
    message: 'Invalid email address',
  }),
  password: zod.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
})

export type SignInSchemaType = zod.infer<typeof SignInSchema>

export const SignUpSchema = zod.object({
  name: zod.string().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
  email: zod.string().email({
    message: 'Invalid email address',
  }),
  password: zod.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
})

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>

export const ForgotPasswordSchema = zod.object({
  email: zod.string().email({
    message: 'Invalid email address',
  }),
})

export type ForgotPasswordSchemaType = zod.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = zod.object({
  token: zod.string().min(1, {
    message: 'Token is required',
  }),
  password: zod.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  confirmPassword: zod.string().min(6, {
    message: 'Password confirmation is required',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>

export const EventSchema = zod.object({
  title: zod.string().min(3, {
    message: 'Title must be at least 3 characters long',
  }),
  description: zod.string().min(10, {
    message: 'Description must be at least 10 characters long',
  }),
  date: zod.string().min(1, {
    message: 'Date is required',
  }),
  time: zod.string().min(1, {
    message: 'Time is required',
  }),
  location: zod.string().min(3, {
    message: 'Location must be at least 3 characters long',
  }),
  image: zod.string().optional(),
  category: zod.string().min(1, {
    message: 'Category is required',
  }),
  attendees: zod.number().min(0),
  upcoming: zod.boolean(),
  images: zod.string().optional(), // JSON string for archived events
  report: zod.string().optional(), // For archived events
})

export type EventSchemaType = zod.infer<typeof EventSchema>

export const NewsSchema = zod.object({
  title: zod.string().min(3, {
    message: 'Title must be at least 3 characters long',
  }),
  excerpt: zod.string().min(10, {
    message: 'Excerpt must be at least 10 characters long',
  }),
  content: zod.string().min(50, {
    message: 'Content must be at least 50 characters long',
  }),
  image: zod.string().optional(),
  category: zod.string().min(1, {
    message: 'Category is required',
  }),
  author: zod.string().min(1, {
    message: 'Author is required',
  }),
  published: zod.boolean(),
})

export type NewsSchemaType = zod.infer<typeof NewsSchema>