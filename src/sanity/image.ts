import { createImageUrlBuilder } from '@sanity/image-url'
import { apiVersion, dataset, projectId } from './env'
import { createClient } from 'next-sanity'

const dummyClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
})

const builder = createImageUrlBuilder(dummyClient)

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}
