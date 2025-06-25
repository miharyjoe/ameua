import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db, users, members } from "@/schema/schema"
import { eq } from "drizzle-orm"
import { UserRole } from "@/schema"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { role } = body

    // Validate role
    if (!role || (role !== UserRole.USER && role !== UserRole.ADMIN)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Prevent admin from demoting themselves
    if (session.user.id === id && role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "You cannot change your own admin role" },
        { status: 400 }
      )
    }

    // Update user role
    const updatedUser = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })

    if (!updatedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Prevent admin from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      )
    }

    // Check if user exists
    const userToDelete = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!userToDelete.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete associated member profile first (if exists)
    await db.delete(members).where(eq(members.userId, id))

    // Delete the user (this will cascade delete accounts, sessions, etc.)
    await db.delete(users).where(eq(users.id, id))

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
