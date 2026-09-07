import { NextResponse } from 'next/server'

/**
 * Temporary deploy diagnostic. Reports only whether env vars are *visible* to the
 * running app — never their values — so it is safe to hit publicly. Delete once the
 * Blob storage question is settled.
 */
export function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN

  return NextResponse.json({
    blobTokenPresent: Boolean(token),
    blobTokenLength: token ? token.length : 0,
    databaseUrlPresent: Boolean(process.env.DATABASE_URL),
    payloadSecretPresent: Boolean(process.env.PAYLOAD_SECRET),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    builtAt: new Date().toISOString(),
  })
}
