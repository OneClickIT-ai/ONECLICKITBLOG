import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'affiliateUrl',
      title: 'Affiliate URL',
      type: 'url',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. "$29.99" or "$20-$50"',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'verdict',
      title: 'Verdict',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      options: {
        list: [
          { title: 'Best Overall', value: 'best-overall' },
          { title: 'Best Value', value: 'best-value' },
          { title: 'Premium Pick', value: 'premium-pick' },
          { title: 'Budget Pick', value: 'budget-pick' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'image',
    },
  },
})
