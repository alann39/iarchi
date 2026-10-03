import {CommentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Pick schema — Archi's personal taste: favorite music & movies.
 * Powers the "personal blocks" (P2): chat tool `show_taste` renders these
 * as rich cards. Music picks are playable via 30s iTunes previews
 * (previewUrl, no API key) with optional Spotify/YouTube links.
 * Dummy-seeded 2026-10-03; Archi replaces with his real favorites.
 */

export const pick = defineType({
  name: 'pick',
  title: 'Pick',
  icon: CommentIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Music', value: 'music'},
          {title: 'Movie', value: 'movie'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Track/album title, or movie title.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'creator',
      title: 'Artist / Director',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.min(1900).max(2100),
    }),
    defineField({
      name: 'note',
      title: 'Why this one',
      type: 'text',
      rows: 2,
      description: "Archi's one-liner on why this is a favorite.",
    }),
    defineField({
      name: 'previewUrl',
      title: 'Audio preview URL',
      type: 'url',
      description: 'Music only: 30s playable preview (iTunes Search API gives these, no key needed).',
      hidden: ({parent}) => parent?.category !== 'music',
    }),
    defineField({
      name: 'artworkUrl',
      title: 'Artwork URL',
      type: 'url',
      description: 'Music only: album artwork (iTunes artworkUrl100).',
      hidden: ({parent}) => parent?.category !== 'music',
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify link',
      type: 'url',
      description: 'Optional "open in Spotify" link.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower shows first.',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'creator',
      category: 'category',
    },
    prepare({title, subtitle, category}) {
      return {
        title: `${category === 'music' ? '♪' : '▸'} ${title}`,
        subtitle,
      }
    },
  },
})
