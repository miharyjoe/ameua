import { NextRequest, NextResponse } from "next/server"
import { db } from "@/schema/schema"
import { news } from "@/schema/schema"
import { NewsSchema } from "@/schema"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const allNews = await db.select().from(news)
    return NextResponse.json(allNews)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    
    // Extract form fields
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const author = formData.get('author') as string
    const published = formData.get('published') === 'true'
    
    // Handle file upload (if provided)
    const imageFile = formData.get('image') as File | null
    let imageUrl = null

    if (imageFile && imageFile.size > 0) {
      // Generate unique filename
      const fileExtension = imageFile.name.split('.').pop()
      const fileName = `news-${Date.now()}.${fileExtension}`
      
      console.log('Uploading news image:', { fileName, size: imageFile.size })
      
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const newArticle = await db.insert(news).values(articleData).returning()
    
    return NextResponse.json(newArticle[0], { status: 201 })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 })
  }
} 