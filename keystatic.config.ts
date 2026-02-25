import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    // In local development, save content to the local file system
    kind: 'local',
  },
  // We'll eventually set this up to push to GitHub, but 'local' is fine for now
  ui: {
    brand: { name: 'Ann M. Thane Gallery CMS' }
  },
  collections: {
    artworks: collection({
      label: 'Artworks',
      slugField: 'title',
      path: 'src/content/artworks/*/',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.select({
          label: 'Category',
          description: 'Which portfolio page does this belong to?',
          options: [
            { label: 'The Women Series', value: 'women' },
            { label: 'Mosaics', value: 'mosaics' },
            { label: 'Creative Connections Clubhouse Mosaic', value: 'creative-connections-clubhouse-mosaic' },
            { label: 'Pottery', value: 'pottery' },
            { label: 'Murals', value: 'murals' },
            { label: 'Pyrography', value: 'pyrography' },
            { label: 'Photography', value: 'photography' },
            { label: 'Jewelry', value: 'jewelry' },
            { label: 'Embellished Furniture', value: 'embellished-furniture' },
            { label: 'Embellished Shells', value: 'embellished-shells' },
            { label: 'Miscellaneous Projects', value: 'miscellaneous-projects' },
            { label: 'Older Work', value: 'older-work' }
          ],
          defaultValue: 'women',
        }),
        image: fields.image({
          label: 'Artwork Image',
          directory: 'public/images/artworks',
          publicPath: '/images/artworks/',
        }),
        medium: fields.text({ label: 'Medium', description: 'e.g. Mixed Media, Oil on Canvas' }),
        dimensions: fields.text({ label: 'Dimensions', description: 'e.g. 24" x 36"' }),
        year: fields.text({ label: 'Year Created' }),
        status: fields.select({
          label: 'Availability Status',
          options: [
            { label: 'Available', value: 'available' },
            { label: 'Sold', value: 'sold' },
            { label: 'Private Collection', value: 'private-collection' },
            { label: 'Not for Sale', value: 'nfs' }
          ],
          defaultValue: 'available'
        }),
        description: fields.document({
          label: 'Description / Story',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),
  },
});
