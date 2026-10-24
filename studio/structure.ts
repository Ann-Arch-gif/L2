import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import type {StructureResolver} from 'sanity/structure'

export const singletonTypes = new Set(['siteSettings'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('L2 Angkor')
    .items([
      S.documentTypeListItem('room').title('Rooms').icon(HomeIcon),
      S.divider(),
      S.listItem()
        .title('Website settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Website settings')),
    ])
