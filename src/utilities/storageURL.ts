const isStorageEnabled = () => Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)

// `https://<ref>.storage.supabase.co/storage/v1/s3` → `.../storage/v1/object/public`.
// S3_PUBLIC_URL overrides it, e.g. for a CDN in front of the bucket.
const getPublicStorageURL = () =>
  (
    process.env.S3_PUBLIC_URL ||
    (process.env.S3_ENDPOINT || '').replace(/\/s3\/?$/, '/object/public')
  ).replace(/\/$/, '')

/** Direct public URL for an object in the media bucket. `filename` must be unencoded. */
export const getPublicFileURL = ({ filename, prefix }: { filename: string; prefix?: string }) =>
  [getPublicStorageURL(), process.env.S3_BUCKET, prefix, encodeURIComponent(filename)]
    .filter(Boolean)
    .join('/')

const PROXY_PATH = /^\/api\/media\/file\/([^?]+)(?:\?(.*))?$/

/**
 * Rewrites `/api/media/file/*` URLs anywhere in `data` to direct bucket URLs.
 *
 * Pages edited in Puck store a snapshot of each picked media doc — URL included — in
 * `puckData`, so docs picked before the bucket was served directly still point at the
 * Payload proxy. Rewriting at read time fixes those without a data migration.
 */
export function rewriteMediaProxyURLs<T>(data: T): T {
  if (!isStorageEnabled()) return data

  const walk = (value: unknown): unknown => {
    if (typeof value === 'string') {
      const match = value.match(PROXY_PATH)
      if (!match) return value
      const params = new URLSearchParams(match[2] || '')
      const prefix = params.get('prefix') || undefined
      params.delete('prefix')
      const query = params.toString()
      const url = getPublicFileURL({ filename: decodeURIComponent(match[1]), prefix })
      return query ? `${url}?${query}` : url
    }
    if (Array.isArray(value)) return value.map(walk)
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v)]))
    }
    return value
  }

  return walk(data) as T
}
