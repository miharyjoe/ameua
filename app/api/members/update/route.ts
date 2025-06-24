import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db, members, users } from '@/schema/schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@supabase/supabase-js'

// Supabase client for storage
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

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user ID from database if not in session (fallback)
    let userId = session.user.id
    if (!userId && session.user.email) {
      const userResult = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1)
      
      if (userResult.length > 0) {
        userId = userResult[0].id
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      )
    }

    // Check if user is a member
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.userId, userId))
      .limit(1)

    if (existingMember.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    
    // Extract form fields
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || null
    const promotion = parseInt(formData.get('promotion') as string)
    const currentRole = formData.get('currentRole') as string
    const company = formData.get('company') as string
    const location = formData.get('location') as string
    const linkedin = formData.get('linkedin') as string || null
    const facebook = formData.get('facebook') as string || null
    const bio = formData.get('bio') as string || null
    const expertiseJson = formData.get('expertise') as string || '[]'
    const deleteImage = formData.get('deleteImage') === 'true'
    
    // Handle file upload (if new file provided)
    const profileImageFile = formData.get('profileImage') as File | null
    let profileImageUrl = existingMember[0].profileImage // Keep existing image by default

    // Handle image deletion
    if (deleteImage) {
      // Delete old image from storage if it exists
      if (existingMember[0].profileImage) {
        const oldFileName = existingMember[0].profileImage.split('/').pop()
        if (oldFileName) {
          console.log('Deleting old profile image:', oldFileName)
          await supabase.storage
            .from('ameuafile')
            .remove([oldFileName])
        }
      }
      profileImageUrl = null // Set to null to remove from database
    } else if (profileImageFile && profileImageFile.size > 0) {
      // Generate unique filename
      const fileExtension = profileImageFile.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExtension}`
      
      console.log('Uploading new profile image:', { fileName, size: profileImageFile.size })
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ameuafile')
        .upload(fileName, profileImageFile, {
          contentType: profileImageFile.type,
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
      
      profileImageUrl = publicUrl

      // Delete old image if it exists and is different
      if (existingMember[0].profileImage && existingMember[0].profileImage !== profileImageUrl) {
        const oldFileName = existingMember[0].profileImage.split('/').pop()
        if (oldFileName) {
          console.log('Deleting old profile image:', oldFileName)
          await supabase.storage
            .from('ameuafile')
            .remove([oldFileName])
        }
      }
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !promotion || !currentRole || !company || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update member record
    const updatedMember = await db
      .update(members)
      .set({
        firstName,
        lastName,
        email,
        phone,
        promotion,
        currentRole,
        company,
        location,
        linkedin,
        facebook,
        bio,
        profileImage: profileImageUrl,
        expertise: expertiseJson,
        updatedAt: new Date(),
      })
      .where(eq(members.userId, userId))
      .returning()

    return NextResponse.json(
      {
        message: 'Member information updated successfully',
        member: updatedMember[0],
      },
      { 
        status: 200,
        headers: {
          // Invalidate cache for members list
          'Cache-Control': 'no-cache',
        }
      }
    )

  } catch (error) {
    console.error('Member update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 