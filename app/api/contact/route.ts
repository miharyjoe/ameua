import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, promotion, subject, message } = body

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    // Send email
    const result = await sendContactEmail({
      firstName,
      lastName,
      email,
      promotion,
      subject,
      message
    })

    if (result.success) {
      return NextResponse.json(
        { message: 'Message envoyé avec succès' },
        { status: 200 }
      )
    } else {
      console.error('Failed to send contact email:', result.error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer plus tard.' },
      { status: 500 }
    )
  }
} 