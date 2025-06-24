import { NextRequest, NextResponse } from 'next/server'
import { db, members } from '@/schema/schema'
import { eq, like, and, or, sql } from 'drizzle-orm'
import { Member } from '@/types/member'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')?.trim() || ''
    const company = searchParams.get('company')?.trim() || ''
    const role = searchParams.get('role')?.trim() || ''
    const promotion = searchParams.get('promotion')?.trim() || ''
    const location = searchParams.get('location')?.trim() || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Build where conditions
    let whereConditions: any[] = []

    if (name) {
      whereConditions.push(
        or(
          like(members.firstName, `%${name}%`),
          like(members.lastName, `%${name}%`)
        )
      )
    }

    if (company) {
      whereConditions.push(like(members.company, `%${company}%`))
    }

    if (role) {
      whereConditions.push(like(members.currentRole, `%${role}%`))
    }

    if (promotion) {
      const promoNum = parseInt(promotion)
      if (!isNaN(promoNum)) {
        whereConditions.push(eq(members.promotion, promoNum))
      }
    }

    if (location) {
      whereConditions.push(like(members.location, `%${location}%`))
    }

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(members)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    
    const totalCount = totalCountResult[0].count

    // Fetch members with pagination
    const membersData = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        email: members.email,
        phone: members.phone,
        promotion: members.promotion,
        currentRole: members.currentRole,
        company: members.company,
        location: members.location,
        linkedin: members.linkedin,
        facebook: members.facebook,
        bio: members.bio,
        profileImage: members.profileImage,
        expertise: members.expertise,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
      })
      .from(members)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(members.createdAt)
      .limit(limit)
      .offset(offset)

    // Transform data for frontend
    const transformedMembers: Member[] = membersData.map(member => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      email: member.email,
      phone: member.phone || undefined,
      promo: member.promotion.toString(),
      currentRole: member.currentRole,
      company: member.company,
      location: member.location,
      image: member.profileImage || "/placeholder.svg",
      linkedin: member.linkedin || undefined,
      facebook: member.facebook || undefined,
      bio: member.bio || undefined,
      expertise: member.expertise ? JSON.parse(member.expertise) : [],
      joinedAt: member.createdAt,
    }))

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      members: transformedMembers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    console.error('Fetch members error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 