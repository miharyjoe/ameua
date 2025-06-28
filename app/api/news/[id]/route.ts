import { NextRequest, NextResponse } from "next/server"
import { db } from "@/schema/schema"
import { news } from "@/schema/schema"
import { NewsSchema } from "@/schema"
import { eq } from "drizzle-orm"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const article = await db.select().from(news).where(eq(news.id, id))
    
    if (!article.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }
    
    return NextResponse.json(article[0])
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if existing article exists
    const existingArticle = await db.select().from(news).where(eq(news.id, id))
    if (!existingArticle.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Parse form data
    const formData = await request.formData()
    
    // Extract form fields
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const author = formData.get('author') as string
    const published = formData.get('published') === 'true'
    const deleteImage = formData.get('deleteImage') === 'true'
    
    // Handle file upload (if new file provided)
    const imageFile = formData.get('image') as File | null
    let imageUrl = existingArticle[0].image // Keep existing image by default

    // Handle image deletion
    if (deleteImage) {
      // Delete old image from storage if it exists
      if (existingArticle[0].image) {
        const oldFileName = existingArticle[0].image.split('/').pop()
        if (oldFileName) {
          console.log('Deleting old news image:', oldFileName)
          await supabase.storage
            .from('ameuafile')
            .remove([oldFileName])
        }
      }
      imageUrl = null // Set to null to remove from database
    } else if (imageFile && imageFile.size > 0) {
      // Handle new image upload
      // Generate unique filename
      const fileExtension = imageFile.name.split('.').pop()
      const fileName = `news-${id}-${Date.now()}.${fileExtension}`
      
      console.log('Uploading new news image:', { fileName, size: imageFile.size })
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ameuafile')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { error: `Upload failed: ${uploadError.message}` },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ameuafile')
        .getPublicUrl(fileName)
      
      imageUrl = publicUrl

      // Delete old image if it exists and is different
      if (existingArticle[0].image && existingArticle[0].image !== imageUrl) {
        const oldFileName = existingArticle[0].image.split('/').pop()
        if (oldFileName) {
          console.log('Deleting old news image:', oldFileName)
          await supabase.storage
            .from('ameuafile')
            .remove([oldFileName])
        }
      }
    }

    // Validate required fields
    if (!title || !excerpt || !content || !category || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const articleData = {
      title,
      excerpt,
      content,
      image: imageUrl,
      category,
      author,
      published,
      updatedAt: new Date(),
    }
    
    const updatedArticle = await db
      .update(news)
      .set(articleData)
      .where(eq(news.id, id))
      .returning()
    
    return NextResponse.json(updatedArticle[0])
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

// Add optimized PATCH method for toggle publish
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

    // Direct update without selecting first - more efficient
    const updatedArticle = await db
      .update(news)
      .set({ 
        published: body.published,
        updatedAt: new Date(),
      })
      .where(eq(news.id, id))
      .returning()
    
    if (!updatedArticle.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      published: updatedArticle[0].published 
    })
  } catch (error) {
    console.error("Error toggling publish status:", error)
    return NextResponse.json({ error: "Failed to toggle publish status" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get article to delete associated image
    const existingArticle = await db.select().from(news).where(eq(news.id, id))
    
    if (!existingArticle.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Delete image from storage if it exists
    if (existingArticle[0].image) {
      const fileName = existingArticle[0].image.split('/').pop()
      if (fileName) {
        console.log('Deleting news image:', fileName)
        await supabase.storage
          .from('ameuafile')
          .remove([fileName])
      }
    }
    
    const deletedArticle = await db
      .delete(news)
      .where(eq(news.id, id))
      .returning()
    
    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
} 