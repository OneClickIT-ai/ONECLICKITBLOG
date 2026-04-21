import 'server-only'

import { createClient, type QueryParams } from 'next-sanity'
import { apiVersion, dataset, projectId, token } from './env'

const serverClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
    })
  : null

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<T> {
  if (!serverClient) {
    // Return empty/null when Sanity is not configured (e.g. during initial build)
    return null as T
  }

  try {
    return await serverClient.fetch<T>(query, params, {
      next: {
        revalidate: tags.length ? false : 60,
        tags,
      },
    })
  } catch (err) {
    // Graceful fallback during CI builds with placeholder credentials
    const status = (err as { statusCode?: number }).statusCode
    if (status === 404 || status === 401 || status === 403) {
      console.warn(`[sanityFetch] Sanity request failed (${status}), returning null`)
      return null as T
    }
    throw err
  }
}
