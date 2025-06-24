export interface Member {
  id: string
  name: string
  email: string
  phone?: string
  promo: string
  currentRole: string
  company: string
  location: string
  image: string
  linkedin?: string
  facebook?: string
  bio?: string
  expertise: string[]
  joinedAt: Date
}

export interface MemberRegistration {
  firstName: string
  lastName: string
  email: string
  phone?: string
  promotion: number
  currentRole: string
  company: string
  location: string
  linkedin?: string
  facebook?: string
  bio?: string
  expertise: string[]
  acceptTerms: boolean
  acceptNewsletter: boolean
}

export interface MemberStatus {
  isMember: boolean
  member: DatabaseMember | null
}

export interface DatabaseMember {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  promotion: number
  currentRole: string
  company: string
  location: string
  linkedin?: string
  facebook?: string
  bio?: string
  profileImage?: string
  expertise: string
  createdAt: Date
  updatedAt: Date
} 