import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Social Link schema. Contact/social rows (GitHub, LinkedIn, email, …)
 * rendered by the chat UI (show_contact tool).
 */

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      description: 'e.g. "GitHub", "LinkedIn", "Email", "X".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Display text, e.g. "@alann39" or "hello@archi.dev".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'url',
    },
  },
})
