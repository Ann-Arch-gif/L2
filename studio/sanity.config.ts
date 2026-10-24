import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import {singletonTypes, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'L2 Angkor Admin',
  projectId: '97y5asq7',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    internationalizedArray({
      languages: [
        {id: 'en', title: 'English'},
        {id: 'km', title: 'ខ្មែរ Khmer'},
        {id: 'zh', title: '中文 Chinese'},
      ],
      defaultLanguages: ['en', 'km', 'zh'],
      fieldTypes: ['string', 'text'],
      languageDisplay: 'titleOnly',
    }),
  ],

  schema: {
    types: schemaTypes,
    // Settings is a single page, so it can't be created again from the "+" menu.
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
