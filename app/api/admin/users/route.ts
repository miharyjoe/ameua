import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db, users, members } from "@/schema/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    // Check if user is admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all users with their member data (if exists)
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        image: users.image,
        emailVerified: users.emailVerified,
        // Member data
        memberId: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        promotion: members.promotion,
        currentRole: members.currentRole,
        company: members.company,
        memberCreatedAt: members.createdAt,
      })
      .from(users)
      .leftJoin(members, eq(users.id, members.userId))
      .orderBy(users.name)

    return NextResponse.json(allUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
} 