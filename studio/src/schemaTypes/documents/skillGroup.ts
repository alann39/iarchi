import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Skill Group schema. Named groups of skills (e.g. "Frontend",
 * "Data & Finance") rendered by the chat UI (show_skills tool).
 */

export const skillGroup = defineType({
  name: 'skillGroup',
  title: 'Skill Group',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Group name, e.g. "Frontend".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (rule) => rule.required().min(1),
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
      title: 'title',
    },
  },
})
