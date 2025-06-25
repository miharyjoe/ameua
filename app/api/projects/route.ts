import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/schema/schema"
import { projects } from "@/schema/schema"
import { ProjectSchema } from "@/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
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

export async function GET() {
  try {
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt))
    return NextResponse.json(allProjects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    // Extract form fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const goal = parseFloat(formData.get('goal') as string)
    const raised = parseFloat(formData.get('raised') as string) || 0
    const contributors = parseInt(formData.get('contributors') as string) || 0
    const deadline = formData.get('deadline') as string
    const impact = formData.get('impact') as string || ""
    const needs = formData.get('needs') as string || "[]"
    const isFinished = formData.get('isFinished') === 'true'
    const testimonial = formData.get('testimonial') as string || null
    const totalRaised = formData.get('totalRaised') ? parseFloat(formData.get('totalRaised') as string) : null

    // Handle image upload (if provided)
    const imageFile = formData.get('image') as File | null
    let imageUrl = null

    if (imageFile && imageFile.size > 0) {
      // Generate unique filename
      const fileExtension = imageFile.name.split('.').pop()
      const fileName = `project-${Date.now()}.${fileExtension}`
      
      console.log('Uploading project image:', { fileName, size: imageFile.size })
      
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
    }

    // Validate required fields
    if (!title || !description || !category || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const projectData = {
      title,
      description,
      category,
      goal,
      raised,
      contributors,
      deadline: deadline ? new Date(deadline) : null,
      image: imageUrl,
      impact,
      needs,
      isFinished,
      testimonial,
      totalRaised,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    console.log('Project data to be saved:', { 
      ...projectData, 
      image: imageUrl ? 'IMAGE_URL_SET' : 'NULL'
    })
    
    const newProject = await db.insert(projects).values(projectData).returning()
    
    console.log('Project created successfully:', newProject[0].id)
    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    return NextResponse.json(newProject[0], { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
} 