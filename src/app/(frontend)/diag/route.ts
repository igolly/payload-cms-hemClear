import { NextResponse } from 'next/server'

/**
 * Temporary deploy diagnostic. Reports only whether env vars are *visible* to the
 * running app — never their values — so it is safe to hit publicly. Delete once the
 * Blob storage question is settled.
 */
export function GET() {
  return NextResponse.json({
    s3BucketPresent: Boolean(process.env.S3_BUCKET),
    s3EndpointPresent: Boolean(process.env.S3_ENDPOINT),
    s3KeyPresent: Boolean(process.env.S3_ACCESS_KEY_ID),
    s3SecretPresent: Boolean(process.env.S3_SECRET_ACCESS_KEY),
    databaseUrlPresent: Boolean(process.env.DATABASE_URL),
    payloadSecretPresent: Boolean(process.env.PAYLOAD_SECRET),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    builtAt: new Date().toISOString(),
  })
}
