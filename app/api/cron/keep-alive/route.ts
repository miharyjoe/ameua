import { NextResponse } from "next/server"
import { db } from "@/schema/schema"
import { sql } from "drizzle-orm"

export const revalidate = 0

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { ok: false, error: "Missing env: DATABASE_URL" },
        { status: 500 }
      )
    }

    // Direct DB ping that bypasses PostgREST/RLS and needs no auth
    await db.execute(sql`select 1 as ok`)

    return NextResponse.json({ ok: true, pinged: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}


