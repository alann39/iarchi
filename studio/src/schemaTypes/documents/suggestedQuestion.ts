import {CommentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Suggested Question schema. Tappable starter questions shown above
 * the chat dock so visitors know what to ask.
 */

export const suggestedQuestion = defineType({
  name: 'suggestedQuestion',
  title: 'Suggested Question',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'e.g. "What have you built?"',
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
      title: 'question',
    },
  },
})
