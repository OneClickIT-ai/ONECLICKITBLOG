import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
    }),
    defineField({
      name: 'adsenseId',
      title: 'AdSense ID',
      type: 'string',
      description: 'Google AdSense publisher ID (e.g. ca-pub-XXXXXXX)',
    }),
    defineField({
      name: 'enableAds',
      title: 'Enable Ads',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'enableAffiliate',
      title: 'Enable Affiliate Links',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'newsletterEndpoint',
      title: 'Newsletter Endpoint',
      type: 'url',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'twitter', title: 'Twitter', type: 'url' },
        { name: 'github', title: 'GitHub', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn', type: 'url' },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
