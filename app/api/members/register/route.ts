import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db, members, users } from '@/schema/schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@supabase/supabase-js'
import { MemberStatus, DatabaseMember } from '@/types/member'

// Supabase client for storage with anon key and policies
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
    console.log('Session debug:', {
      session: session,
      user: session?.user,
      userId: session?.user?.id
    })
    
    if (!session?.user?.email) {
      console.log('Authentication failed - no session or user email')
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
        console.log('Found user ID from database:', userId)
      }
    }

    if (!userId) {
      console.log('Could not determine user ID')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.userId, userId))
      .limit(1)

    if (existingMember.length > 0) {
      return NextResponse.json(
        { error: 'You are already registered as a member' },
        { status: 409 }
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
    
    // Handle file upload
    const profileImageFile = formData.get('profileImage') as File | null
    let profileImageUrl = null

    if (profileImageFile && profileImageFile.size > 0) {
      // Generate unique filename
      const fileExtension = profileImageFile.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExtension}`
      
      console.log('Uploading file:', { fileName, size: profileImageFile.size, type: profileImageFile.type })
      
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

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ameuafile')
        .getPublicUrl(fileName)
      
      profileImageUrl = publicUrl
    }

    // Validate required fields (expertise is optional now)
    if (!firstName || !lastName || !email || !promotion || !currentRole || !company || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create member record
    const newMember = await db
      .insert(members)
      .values({
        userId: userId,
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
        expertise: expertiseJson
      })
      .returning()

    return NextResponse.json(
      {
        message: 'Member registration submitted successfully',
        member: newMember[0],
      },
      { 
        status: 201,
        headers: {
          // Invalidate cache for members list
          'Cache-Control': 'no-cache',
        }
      }
    )

  } catch (error) {
    console.error('Member registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get current user's member status
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.userId, session.user.id))
      .limit(1)

    const memberStatus: MemberStatus = {
      isMember: existingMember.length > 0,
      member: existingMember.length > 0 ? {
        ...existingMember[0],
        phone: existingMember[0].phone || undefined,
        linkedin: existingMember[0].linkedin || undefined,
        facebook: existingMember[0].facebook || undefined,
        bio: existingMember[0].bio || undefined,
        profileImage: existingMember[0].profileImage || undefined,
        expertise: existingMember[0].expertise || '[]',
      } : null,
    }

    return NextResponse.json(memberStatus)

  } catch (error) {
    console.error('Get member status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 