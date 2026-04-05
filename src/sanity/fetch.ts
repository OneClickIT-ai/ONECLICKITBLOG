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

  return serverClient.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : 60,
      tags,
    },
  })
}
