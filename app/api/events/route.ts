import { NextRequest, NextResponse } from "next/server"
import { db } from "@/schema/schema"
import { events } from "@/schema/schema"
import { EventSchema } from "@/schema"
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

export async function GET() {
  try {
    const allEvents = await db.select().from(events)
    return NextResponse.json(allEvents)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    
    // Debug: Log all received FormData entries
    console.log('Received FormData entries:')
    for (const [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value)
    }
    
    // Extract form fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const location = formData.get('location') as string
    const category = formData.get('category') as string
    const attendees = parseInt(formData.get('attendees') as string)
    const upcoming = formData.get('upcoming') === 'true'
    const report = formData.get('report') as string || ""
    
    // Handle main image upload (if provided)
    const imageFile = formData.get('image') as File | null
    let imageUrl = null

    console.log('Main image file check:', { 
      hasImageFile: !!imageFile, 
      fileName: imageFile?.name, 
      fileSize: imageFile?.size,
      fileType: imageFile?.type 
    })

    if (imageFile && imageFile.size > 0) {
      // Generate unique filename
      const fileExtension = imageFile.name.split('.').pop()
      const fileName = `event-${Date.now()}.${fileExtension}`
      
      console.log('Uploading main event image:', { fileName, size: imageFile.size })
      
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

      console.log('Main image upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ameuafile')
        .getPublicUrl(fileName)
      
      imageUrl = publicUrl
      console.log('Generated main image public URL:', imageUrl)
    }

    // Handle gallery images upload
    const galleryImageCount = parseInt(formData.get('galleryImageCount') as string || '0')
    const galleryImageUrls: string[] = []

    console.log('Gallery images count:', galleryImageCount)

    if (galleryImageCount > 0) {
      for (let i = 0; i < galleryImageCount; i++) {
        const galleryFile = formData.get(`galleryImage_${i}`) as File | null
        
        if (galleryFile && galleryFile.size > 0) {
          // Generate unique filename for gallery image
          const fileExtension = galleryFile.name.split('.').pop()
          const fileName = `event-gallery-${Date.now()}-${i}.${fileExtension}`
          
          console.log(`Uploading gallery image ${i + 1}:`, { fileName, size: galleryFile.size })
          
          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ameuafile')
            .upload(fileName, galleryFile, {
              contentType: galleryFile.type,
              upsert: false
            })

          if (uploadError) {
            console.error(`Gallery image ${i + 1} upload error:`, uploadError)
            // Continue with other images even if one fails
            continue
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('ameuafile')
            .getPublicUrl(fileName)
          
          galleryImageUrls.push(publicUrl)
          console.log(`Gallery image ${i + 1} uploaded successfully:`, publicUrl)
        }
      }
    }

    // Validate required fields
    if (!title || !description || !date || !time || !location || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare images JSON string
    const imagesJson = galleryImageUrls.length > 0 ? JSON.stringify(galleryImageUrls) : ""

    const eventData = {
      title,
      description,
      date: new Date(date),
      time,
      location,
      image: imageUrl,
      category,
      attendees,
      upcoming,
      images: imagesJson,
      report,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    console.log('Event data to be saved:', { 
      ...eventData, 
      image: imageUrl ? 'MAIN_IMAGE_URL_SET' : 'NULL',
      images: imagesJson ? `GALLERY_IMAGES_SET(${galleryImageUrls.length})` : 'EMPTY'
    })
    
    const newEvent = await db.insert(events).values(eventData).returning()
    
    console.log('Event created successfully:', newEvent[0].id)
    return NextResponse.json(newEvent[0], { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
} 