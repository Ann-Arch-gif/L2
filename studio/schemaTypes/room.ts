import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {furnitureOptions, serviceOptions} from './options'

type Localized = {language?: string; value?: string}[] | undefined

const english = (value: Localized) => value?.find((v) => v.language === 'en')?.value

export const room = defineType({
  name: 'room',
  title: 'Room',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'photos', title: 'Photos'},
    {name: 'furniture', title: 'Furniture'},
    {name: 'services', title: 'Services'},
    {name: 'description', title: 'Description'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Room name',
      type: 'internationalizedArrayString',
      group: 'basics',
      validation: (rule) =>
        rule.custom((value: Localized) => (english(value) ? true : 'Please write the English name')),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      description: 'Click "Generate". This becomes the page address, e.g. /rooms/garden-studio',
      type: 'slug',
      group: 'basics',
      options: {source: (doc) => english(doc.name as Localized) ?? '', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showOnWebsite',
      title: 'Show on website',
      description: 'Turn off to hide this room without deleting it.',
      type: 'boolean',
      group: 'basics',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Show on home page',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
    }),
    defineField({
      name: 'priceFrom',
      title: 'Monthly price from (USD)',
      type: 'number',
      group: 'basics',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Availability',
      type: 'string',
      group: 'basics',
      initialValue: 'available',
      options: {
        list: [
          {title: 'Available now', value: 'available'},
          {title: 'Available from a date', value: 'soon'},
          {title: 'Rented', value: 'rented'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'availableFrom',
      title: 'Available from',
      type: 'date',
      group: 'basics',
      hidden: ({document}) => document?.status !== 'soon',
    }),
    defineField({name: 'size', title: 'Size (m²)', type: 'number', group: 'basics'}),
    defineField({
      name: 'bedrooms',
      title: 'Bedrooms',
      description: 'Use 0 for a studio.',
      type: 'number',
      group: 'basics',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Bathrooms',
      type: 'number',
      group: 'basics',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'capacity',
      title: 'Maximum people',
      type: 'number',
      group: 'basics',
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Display order',
      description: 'Lower numbers appear first.',
      type: 'number',
      group: 'basics',
      initialValue: 10,
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      description: 'Drag to reorder. The first photo is the main one.',
      type: 'array',
      group: 'photos',
      of: [defineArrayMember({type: 'photo'})],
      options: {layout: 'grid'},
      validation: (rule) => rule.min(1).warning('Add at least one photo'),
    }),
    defineField({
      name: 'furniture',
      title: 'Furniture & appliances in the room',
      type: 'array',
      group: 'furniture',
      of: [defineArrayMember({type: 'string'})],
      options: {list: furnitureOptions, layout: 'grid'},
    }),
    defineField({
      name: 'extraFurniture',
      title: 'Other items not in the list',
      type: 'array',
      group: 'furniture',
      of: [defineArrayMember({type: 'customItem'})],
    }),
    defineField({
      name: 'services',
      title: 'Services included in the rent',
      type: 'array',
      group: 'services',
      of: [defineArrayMember({type: 'string'})],
      options: {list: serviceOptions, layout: 'grid'},
    }),
    defineField({
      name: 'extraServices',
      title: 'Other services not in the list',
      type: 'array',
      group: 'services',
      of: [defineArrayMember({type: 'customItem'})],
    }),
    defineField({
      name: 'summary',
      title: 'Short summary',
      description: 'One sentence shown on the room card.',
      type: 'internationalizedArrayString',
      group: 'description',
    }),
    defineField({
      name: 'description',
      title: 'Full description',
      description: 'Leave an empty line between paragraphs.',
      type: 'internationalizedArrayText',
      group: 'description',
    }),
  ],
  orderings: [
    {title: 'Display order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
    {title: 'Price', name: 'price', by: [{field: 'priceFrom', direction: 'asc'}]},
  ],
  preview: {
    select: {name: 'name', price: 'priceFrom', status: 'status', media: 'photos.0', visible: 'showOnWebsite'},
    prepare: ({name, price, status, media, visible}) => {
      const statusLabel = {available: 'Available', soon: 'Available soon', rented: 'Rented'}[
        status as string
      ]
      return {
        title: english(name as Localized) || 'New room',
        subtitle: [price ? `$${price}/month` : null, statusLabel, visible === false ? 'Hidden' : null]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
