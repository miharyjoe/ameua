import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db, users, members, events, news } from "@/schema/schema"
import { eq, count } from "drizzle-orm"

export async function GET() {
  try {
    // Check if user is admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all statistics in parallel
    const [
      totalUsers,
      totalAdmins,
      totalMembers,
      upcomingEvents,
      archivedEvents,
      publishedNews,
      draftNews
    ] = await Promise.all([
      // Total users count
      db.select({ count: count() }).from(users),
      
      // Admin users count
      db.select({ count: count() }).from(users).where(eq(users.role, 'admin')),
      
      // Members count (users with member profiles)
      db.select({ count: count() }).from(members),
      
      // Upcoming events count
      db.select({ count: count() }).from(events).where(eq(events.upcoming, true)),
      
      // Archived events count
      db.select({ count: count() }).from(events).where(eq(events.upcoming, false)),
      
      // Published news count
      db.select({ count: count() }).from(news).where(eq(news.published, true)),
      
      // Draft news count
      db.select({ count: count() }).from(news).where(eq(news.published, false))
    ])

    const stats = {
      users: {
        total: totalUsers[0].count,
        admins: totalAdmins[0].count,
        regular: totalUsers[0].count - totalAdmins[0].count,
        members: totalMembers[0].count
      },
      events: {
        upcoming: upcomingEvents[0].count,
        archived: archivedEvents[0].count,
        total: upcomingEvents[0].count + archivedEvents[0].count
      },
      news: {
        published: publishedNews[0].count,
        drafts: draftNews[0].count,
        total: publishedNews[0].count + draftNews[0].count
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
} 