import {BriefcaseIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Experience schema. Work history entries rendered as ledger rows
 * by the chat UI (show_experience tool).
 */

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: BriefcaseIcon,
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'string',
      description: 'Free-form, e.g. "2023" or "Jan 2024".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'string',
      description: 'Free-form. Use "Now" for the current position.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
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
      title: 'company',
      subtitle: 'role',
    },
    prepare({title, subtitle}) {
      return {title, subtitle}
    },
  },
})
