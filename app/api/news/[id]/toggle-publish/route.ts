import { NextRequest, NextResponse } from "next/server"
import { db } from "@/schema/schema"
import { news } from "@/schema/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate input
    if (typeof body.published !== 'boolean') {
      return NextResponse.json(
        { error: 'Published field must be a boolean' },
        { status: 400 }
      )
    }

    // Optimized single query update
    const updatedArticle = await db
      .update(news)
      .set({ 
        published: body.published,
        updatedAt: new Date(),
      })
      .where(eq(news.id, id))
      .returning({
        id: news.id,
        published: news.published,
        updatedAt: news.updatedAt
      })
    
    if (!updatedArticle.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      id: updatedArticle[0].id,
      published: updatedArticle[0].published,
      updatedAt: updatedArticle[0].updatedAt
    })
  } catch (error) {
    console.error("Error toggling publish status:", error)
    return NextResponse.json({ error: "Failed to toggle publish status" }, { status: 500 })
  }
} 