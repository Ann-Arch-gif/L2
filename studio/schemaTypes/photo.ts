import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

// An image with a short description (used for screen readers and search engines).
export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Short description',
      description: 'e.g. "Bedroom with queen bed and garden view". Helps Google and blind visitors.',
      type: 'string',
    }),
  ],
})

export const galleryPhoto = defineType({
  name: 'galleryPhoto',
  title: 'Gallery photo',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({name: 'caption', title: 'Caption', type: 'internationalizedArrayString'}),
    defineField({name: 'alt', title: 'Short description', type: 'string'}),
  ],
})
