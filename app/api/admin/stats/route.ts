import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db, users, members, events, news } from "@/schema/schema"
import { eq, count, max } from "drizzle-orm"

// Cache for stats to avoid unnecessary queries
let cachedStats: any = null
let lastCacheTime: Date | null = null
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes cache

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lastFetch = searchParams.get('lastFetch')

    // Check if we have fresh cached data
    const now = new Date()
    if (cachedStats && lastCacheTime && (now.getTime() - lastCacheTime.getTime()) < CACHE_DURATION) {
      // If client has the same timestamp, return 304 Not Modified
      if (lastFetch && lastFetch === cachedStats.lastUpdated) {
        return new NextResponse(null, { status: 304 })
      }
      return NextResponse.json(cachedStats)
    }

    // Check for data changes since last fetch
    if (lastFetch) {
      const lastFetchDate = new Date(lastFetch)
      
      // Check if any table has been updated since last fetch
      const [
        lastUserUpdate,
        lastMemberUpdate,
        lastEventUpdate,
        lastNewsUpdate
      ] = await Promise.all([
        db.select({ lastUpdate: max(users.id) }).from(users), // Using id as a proxy for changes
        db.select({ lastUpdate: max(members.updatedAt) }).from(members),
        db.select({ lastUpdate: max(events.updatedAt) }).from(events),
        db.select({ lastUpdate: max(news.updatedAt) }).from(news)
      ])

      // If no significant changes detected and we have cached data, return it
      if (cachedStats) {
        const hasChanges = [lastMemberUpdate, lastEventUpdate, lastNewsUpdate].some(result => 
          result[0]?.lastUpdate && result[0].lastUpdate > lastFetchDate
        )
        
        if (!hasChanges) {
          return new NextResponse(null, { status: 304 })
        }
      }
    }

    // Fetch fresh statistics
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
      },
      lastUpdated: now.toISOString()
    }

    // Update cache
    cachedStats = stats
    lastCacheTime = now

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
} 