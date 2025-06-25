import nodemailer from 'nodemailer'

// Create transporter - you'll need to configure this with your email service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Handle SSL certificate issues with shared hosting
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
    ciphers: 'SSLv3', // Use SSLv3 ciphers
  },
})

// Alternative configuration for Gmail (if you want to use Gmail)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD, // Use app password, not regular password
//   },
// })

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@ameua.com',
    to: email,
    subject: 'Reset Your Password - AMEUA',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #666; line-height: 1.6;">
          You requested to reset your password for your AMEUA account. Click the button below to reset your password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007cba; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; line-height: 1.6;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="color: #007cba; word-break: break-all;">
          ${resetUrl}
        </p>
        <p style="color: #666; line-height: 1.6;">
          This link will expire in 1 hour for security reasons.
        </p>
        <p style="color: #666; line-height: 1.6;">
          If you didn't request this password reset, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          AMEUA - Association des Étudiants Malgaches en Ukraine
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendContactEmail({
  firstName,
  lastName,
  email,
  promotion,
  subject,
  message
}: {
  firstName: string
  lastName: string
  email: string
  promotion?: string
  subject: string
  message: string
}) {
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@ameua.mg',
    to: 'info@ameua.mg',
    replyTo: email,
    subject: `Contact - ${subject}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h2 style="color: white; margin: 0;">Nouveau message de contact</h2>
          <p style="color: #e0e7ff; margin: 10px 0 0 0;">Site web AMEUA</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
          <h3 style="color: #1e293b; margin-top: 0;">Informations du contact</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Nom :</td>
              <td style="padding: 8px 0; color: #1e293b;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email :</td>
              <td style="padding: 8px 0; color: #1e293b;">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
              </td>
            </tr>
            ${promotion ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Promotion :</td>
              <td style="padding: 8px 0; color: #1e293b;">${promotion}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Sujet :</td>
              <td style="padding: 8px 0; color: #1e293b;">${subject}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
          <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
            <p style="color: #334155; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            Message reçu le ${new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
            AMEUA - Association des Alumni en Management, Économie et Université d'Antananarivo
          </p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending contact email:', error)
    return { success: false, error }
  }
} 