import {AddIcon} from '@sanity/icons/Add'
import {defineField, defineType} from 'sanity'

// A free-text item for anything not in the checklists, e.g. "Rooftop hammock".
export const customItem = defineType({
  name: 'customItem',
  title: 'Item',
  type: 'object',
  icon: AddIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {label: 'label'},
    prepare: ({label}: {label?: {language?: string; value?: string}[]}) => ({
      title: label?.find((l) => l.language === 'en')?.value || label?.[0]?.value || 'New item',
    }),
  },
})
