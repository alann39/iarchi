import {pick} from './documents/pick'
import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {project} from './documents/project'
import {experience} from './documents/experience'
import {skillGroup} from './documents/skillGroup'
import {socialLink} from './documents/socialLink'
import {suggestedQuestion} from './documents/suggestedQuestion'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {profile} from './singletons/profile'
import {siteSettings} from './singletons/siteSettings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  profile,
  siteSettings,
  // Documents
  page,
  post,
  person,
  project,
  experience,
  skillGroup,
  socialLink,
  suggestedQuestion,
  pick,
  // Objects
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
]
