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
    console.error("Error fetching events:", error)
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
    const images = formData.get('images') as string || ""
    const report = formData.get('report') as string || ""
    
    // Handle file upload (if provided)
    const imageFile = formData.get('image') as File | null
    let imageUrl = null

    console.log('Image file check:', { 
      hasImageFile: !!imageFile, 
      fileName: imageFile?.name, 
      fileSize: imageFile?.size,
      fileType: imageFile?.type 
    })

    if (imageFile && imageFile.size > 0) {
      // Generate unique filename
      const fileExtension = imageFile.name.split('.').pop()
      const fileName = `event-${Date.now()}.${fileExtension}`
      
      console.log('Uploading event image:', { fileName, size: imageFile.size })
      
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

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ameuafile')
        .getPublicUrl(fileName)
      
      imageUrl = publicUrl
      console.log('Generated public URL:', imageUrl)
    }

    // Validate required fields
    if (!title || !description || !date || !time || !location || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
      images,
      report,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    console.log('Event data to be saved:', { ...eventData, image: imageUrl ? 'URL_SET' : 'NULL' })
    
    const newEvent = await db.insert(events).values(eventData).returning()
    
    console.log('Event created successfully:', newEvent[0].id)
    return NextResponse.json(newEvent[0], { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
} 