import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Only test database if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: "warning",
        timestamp: new Date().toISOString(),
        database: "not_configured",
        message: "DATABASE_URL environment variable not set",
      });
    }

    // Dynamically import pool only if DATABASE_URL exists
    const { pool } = await import("@/lib/db");
    const result = await pool.query('SELECT NOW()');

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      version: result.rows[0],
    });
  } catch (error) {
    console.error("[Health Check] Error:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
