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
    const report = formData.get('report') as string || ""
    const deleteImage = formData.get('deleteImage') === 'true'
    
    // Handle main image upload (if new file provided)
    const imageFile = formData.get('image') as File | null
    let imageUrl = existingEvent[0].image // Keep existing image by default

    // Handle main image deletion
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
      // Handle new main image upload
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

      // Delete old main image if it exists and is different
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

    // Handle gallery images
    const existingGalleryImagesJson = formData.get('existingGalleryImages') as string
    const deletedGalleryImagesJson = formData.get('deletedGalleryImages') as string
    const galleryImageCount = parseInt(formData.get('galleryImageCount') as string || '0')

    // Parse existing gallery images
    let existingGalleryImages: string[] = []
    if (existingGalleryImagesJson) {
      try {
        existingGalleryImages = JSON.parse(existingGalleryImagesJson)
      } catch (error) {
        console.error('Error parsing existing gallery images:', error)
      }
    }

    // Parse deleted gallery images and remove them from storage
    let deletedGalleryImages: string[] = []
    if (deletedGalleryImagesJson) {
      try {
        deletedGalleryImages = JSON.parse(deletedGalleryImagesJson)
        
        // Delete images from storage
        for (const imageUrl of deletedGalleryImages) {
          const fileName = imageUrl.split('/').pop()
          if (fileName) {
            console.log('Deleting gallery image:', fileName)
            await supabase.storage
              .from('ameuafile')
              .remove([fileName])
          }
        }
      } catch (error) {
        console.error('Error parsing/deleting gallery images:', error)
      }
    }

    // Upload new gallery images
    const newGalleryImageUrls: string[] = []
    console.log('New gallery images count:', galleryImageCount)

    if (galleryImageCount > 0) {
      for (let i = 0; i < galleryImageCount; i++) {
        const galleryFile = formData.get(`galleryImage_${i}`) as File | null
        
        if (galleryFile && galleryFile.size > 0) {
          // Generate unique filename for gallery image
          const fileExtension = galleryFile.name.split('.').pop()
          const fileName = `event-gallery-${id}-${Date.now()}-${i}.${fileExtension}`
          
          console.log(`Uploading new gallery image ${i + 1}:`, { fileName, size: galleryFile.size })
          
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
          
          newGalleryImageUrls.push(publicUrl)
          console.log(`Gallery image ${i + 1} uploaded successfully:`, publicUrl)
        }
      }
    }

    // Combine existing and new gallery images
    const finalGalleryImages = [...existingGalleryImages, ...newGalleryImageUrls]
    const imagesJson = finalGalleryImages.length > 0 ? JSON.stringify(finalGalleryImages) : ""

    console.log('Final gallery images:', {
      existing: existingGalleryImages.length,
      new: newGalleryImageUrls.length,
      total: finalGalleryImages.length
    })

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
      images: imagesJson,
      report,
      updatedAt: new Date(),
    }
    
    const updatedEvent = await db
      .update(events)
      .set(eventData)
      .where(eq(events.id, id))
      .returning()
    
    console.log('Event updated successfully:', id)
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
    
    // Get event to delete associated images
    const existingEvent = await db.select().from(events).where(eq(events.id, id))
    
    if (!existingEvent.length) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Delete main image from storage if it exists
    if (existingEvent[0].image) {
      const fileName = existingEvent[0].image.split('/').pop()
      if (fileName) {
        console.log('Deleting event image:', fileName)
        await supabase.storage
          .from('ameuafile')
          .remove([fileName])
      }
    }

    // Delete gallery images from storage if they exist
    if (existingEvent[0].images) {
      try {
        const galleryImages = JSON.parse(existingEvent[0].images)
        if (Array.isArray(galleryImages)) {
          for (const imageUrl of galleryImages) {
            const fileName = imageUrl.split('/').pop()
            if (fileName) {
              console.log('Deleting gallery image:', fileName)
              await supabase.storage
                .from('ameuafile')
                .remove([fileName])
            }
          }
        }
      } catch (error) {
        console.error('Error parsing/deleting gallery images during event deletion:', error)
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