import { db, users } from '@/schema/schema'
import { eq } from 'drizzle-orm'

/**
 * Script to promote a user to admin role
 * Usage: npx ts-node scripts/promote-admin.ts <email>
 */

async function promoteUserToAdmin(email: string) {
  try {
    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user.length) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }

    // Update user role to admin
    await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, email))

    console.log(`✅ User ${email} has been promoted to admin`)
  } catch (error) {
    console.error('Error promoting user to admin:', error)
    process.exit(1)
  }
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error('Please provide an email address')
  console.error('Usage: npx ts-node scripts/promote-admin.ts <email>')
  process.exit(1)
}

promoteUserToAdmin(email) 