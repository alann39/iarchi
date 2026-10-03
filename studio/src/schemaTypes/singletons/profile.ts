import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Profile schema Singleton. Single document holding the portfolio owner's
 * identity: name, tagline, location, availability, bio and photo.
 * Content is data, not code — edit here, never hardcode in the frontend.
 */

export const profile = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line headline, e.g. "builder of small, sharp tools."',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Semarang, Indonesia". Leave empty to hide.',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      description: 'e.g. "Available for work". Leave empty to hide the pill.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const document = context.document as
                | {photo?: {asset?: {_ref?: string}}}
                | undefined
              if (document?.photo?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline',
      media: 'photo',
    },
  },
})
