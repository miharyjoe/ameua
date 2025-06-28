import { NextRequest, NextResponse } from "next/server"
import { db } from "@/schema/schema"
import { projects } from "@/schema/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate input
    if (typeof body.isFinished !== 'boolean') {
      return NextResponse.json(
        { error: 'isFinished field must be a boolean' },
        { status: 400 }
      )
    }

    // Optimized single query update
    const updatedProject = await db
      .update(projects)
      .set({ 
        isFinished: body.isFinished,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning({
        id: projects.id,
        isFinished: projects.isFinished,
        updatedAt: projects.updatedAt
      })
    
    if (!updatedProject.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      id: updatedProject[0].id,
      isFinished: updatedProject[0].isFinished,
      updatedAt: updatedProject[0].updatedAt
    })
  } catch (error) {
    console.error("Error toggling project finished status:", error)
    return NextResponse.json({ error: "Failed to toggle project finished status" }, { status: 500 })
  }
} 