export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = (() => {
  const value = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is required')
  }
  return value
})()

export const token = process.env.SANITY_API_READ_TOKEN

export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET
