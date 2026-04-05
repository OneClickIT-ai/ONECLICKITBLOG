import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'digestItem',
  title: 'Digest Item',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'reference',
      to: [{ type: 'source' }],
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'aiTake',
      title: 'AI Take',
      type: 'text',
      rows: 3,
      description: 'AI-generated commentary on this item',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      media: 'image',
    },
  },
})
