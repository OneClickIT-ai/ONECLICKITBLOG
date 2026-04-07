import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const writeToken = process.env.SANITY_API_WRITE_TOKEN

/**
 * Sanity client with write permissions.
 * Only used by worker API routes (ingestion, trends, drafting).
 * Never import this in frontend code.
 */
export const writeClient = projectId && writeToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: writeToken,
    })
  : null

export function getWriteClient() {
  if (!writeClient) {
    throw new Error(
      'Sanity write client not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.',
    )
  }
  return writeClient
}
