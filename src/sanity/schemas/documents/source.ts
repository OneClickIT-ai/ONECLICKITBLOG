import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'source',
  title: 'Source',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Feed URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Source Type',
      type: 'string',
      options: {
        list: [
          { title: 'RSS', value: 'rss' },
          { title: 'API', value: 'api' },
          { title: 'Manual', value: 'manual' },
        ],
      },
      initialValue: 'rss',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
    },
  },
})
