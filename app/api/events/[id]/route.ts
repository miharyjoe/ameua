import { NextRequest, NextResponse } from "next/server"
import { db } from "@/schema/schema"
import { events } from "@/schema/schema"
import { EventSchema } from "@/schema"
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
    const event = await db.select().from(events).where(eq(events.id, id))
    
    if (!event.length) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    
    return NextResponse.json(event[0])
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if existing event exists
    const existingEvent = await db.select().from(events).where(eq(events.id, id))
    if (!existingEvent.length) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Parse form data
    const formData = await request.formData()
    
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
    const deleteImage = formData.get('deleteImage') === 'true'
    
    // Handle file upload (if new file provided)
    const imageFile = formData.get('image') as File | null
    let imageUrl = existingEvent[0].image // Keep existing image by default

    // Handle image deletion
    if (deleteImage) {
      // Delete old image from storage if it exists
      if (existingEvent[0].image) {
        const oldFileName = existingEvent[0].image.split('/').pop()
        if (oldFileName) {
          console.log('Deleting old event image:', oldFileName)
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
      const fileName = `event-${id}-${Date.now()}.${fileExtension}`
      
      console.log('Uploading new event image:', { fileName, size: imageFile.size })
      
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
      if (existingEvent[0].image && existingEvent[0].image !== imageUrl) {
        const oldFileName = existingEvent[0].image.split('/').pop()
        if (oldFileName) {
          console.log('Deleting old event image:', oldFileName)
          await supabase.storage
            .from('ameuafile')
            .remove([oldFileName])
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
      updatedAt: new Date(),
    }
    
    const updatedEvent = await db
      .update(events)
      .set(eventData)
      .where(eq(events.id, id))
      .returning()
    
    return NextResponse.json(updatedEvent[0])
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get event to delete associated image
    const existingEvent = await db.select().from(events).where(eq(events.id, id))
    
    if (!existingEvent.length) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Delete image from storage if it exists
    if (existingEvent[0].image) {
      const fileName = existingEvent[0].image.split('/').pop()
      if (fileName) {
        console.log('Deleting event image:', fileName)
        await supabase.storage
          .from('ameuafile')
          .remove([fileName])
      }
    }
    
    const deletedEvent = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning()
    
    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
} 