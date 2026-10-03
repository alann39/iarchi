import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Site Settings schema Singleton. Global portfolio settings that are not
 * part of the profile: downloadable CV file and contact email.
 * Both are optional — the UI degrades gracefully when empty
 * (CV button shows "coming soon", Let's Talk hides).
 */

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'cvFile',
      title: 'CV File',
      type: 'file',
      description: 'PDF visitors download via the "Download CV" button.',
      options: {
        accept: 'application/pdf',
      },
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Used by the "Let\'s Talk" mailto action. Leave empty to hide it.',
    }),
    defineField({
      name: 'easterEggSecret',
      title: 'Easter egg secret',
      type: 'text',
      rows: 3,
      description:
        'Hidden fun fact revealed by the easter egg (click the orange ■ 5 times). Only shown there — never in normal chat.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
