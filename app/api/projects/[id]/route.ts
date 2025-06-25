import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/schema/schema"
import { projects } from "@/schema/schema"
import { ProjectSchema } from "@/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id

    const [project] = await db.select().from(projects).where(eq(projects.id, projectId))
    
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const projectId = resolvedParams.id

    // Check if project exists
    const [existingProject] = await db.select().from(projects).where(eq(projects.id, projectId))
    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    
    // Extract form fields
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      goal: parseInt(formData.get('goal') as string),
      raised: parseInt(formData.get('raised') as string) || 0,
      contributors: parseInt(formData.get('contributors') as string) || 0,
      deadline: formData.get('deadline') as string,
      impact: formData.get('impact') as string,
      needs: formData.get('needs') as string,
      isFinished: formData.get('isFinished') === 'true',
      testimonial: formData.get('testimonial') as string,
      totalRaised: formData.get('totalRaised') ? parseInt(formData.get('totalRaised') as string) : undefined,
    }

    // Validate data
    const validation = ProjectSchema.safeParse(data)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.errors },
        { status: 400 }
      )
    }

    let imageUrl = existingProject.image

    // Handle image deletion
    const deleteImage = formData.get('deleteImage') === 'true'
    if (deleteImage && existingProject.image) {
      try {
        // Extract filename from URL to delete from Supabase
        const urlParts = existingProject.image.split('/')
        const fileName = urlParts[urlParts.length - 1]
        
        console.log('Deleting old project image from Supabase:', fileName)
        
        // Delete from Supabase storage
        const { error: deleteError } = await supabase.storage
          .from('ameuafile')
          .remove([fileName])

        if (deleteError) {
          console.error('Error deleting old image from Supabase:', deleteError)
        }
        
        imageUrl = null
      } catch (error) {
        console.error("Error deleting old image:", error)
      }
    }

    // Handle new image upload
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
      try {
        // Delete old image if exists and not already deleted
        if (existingProject.image && !deleteImage) {
          try {
            // Extract filename from URL to delete from Supabase
            const urlParts = existingProject.image.split('/')
            const fileName = urlParts[urlParts.length - 1]
            
            console.log('Deleting old project image from Supabase:', fileName)
            
            // Delete from Supabase storage
            const { error: deleteError } = await supabase.storage
              .from('ameuafile')
              .remove([fileName])

            if (deleteError) {
              console.error('Error deleting old image from Supabase:', deleteError)
            }
          } catch (error) {
            console.error("Error deleting old image:", error)
          }
        }

        // Generate unique filename
        const fileExtension = imageFile.name.split('.').pop()
        const fileName = `project-${Date.now()}.${fileExtension}`
        
        console.log('Uploading new project image:', { fileName, size: imageFile.size })
        
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

        console.log('Project image upload successful:', uploadData)

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('ameuafile')
          .getPublicUrl(fileName)
        
        imageUrl = publicUrl
        console.log('Generated project image public URL:', imageUrl)
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError)
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        )
      }
    }

    // Update project
    const [updatedProject] = await db.update(projects)
      .set({
        ...validation.data,
        deadline: data.deadline ? new Date(data.deadline) : null,
        image: imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning()

    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${projectId}`)

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const projectId = resolvedParams.id

    // Check if project exists and get image path
    const [existingProject] = await db.select().from(projects).where(eq(projects.id, projectId))
    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Delete project image if exists
    if (existingProject.image) {
      try {
        // Extract filename from URL to delete from Supabase
        const urlParts = existingProject.image.split('/')
        const fileName = urlParts[urlParts.length - 1]
        
        console.log('Deleting project image from Supabase:', fileName)
        
        // Delete from Supabase storage
        const { error: deleteError } = await supabase.storage
          .from('ameuafile')
          .remove([fileName])

        if (deleteError) {
          console.error('Error deleting project image from Supabase:', deleteError)
        }
      } catch (error) {
        console.error("Error deleting project image:", error)
      }
    }

    // Delete project
    await db.delete(projects).where(eq(projects.id, projectId))

    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
} 