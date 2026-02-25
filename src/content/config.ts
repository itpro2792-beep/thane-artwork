import { z, defineCollection } from 'astro:content';

const artworks = defineCollection({
    type: 'data',
    schema: ({ image }) => z.object({
        title: z.string().optional(),
        category: z.string().optional(),
        image: image(),
        medium: z.string().optional(),
        dimensions: z.string().optional(),
        year: z.string().optional(),
        status: z.string().optional(),
        description: z.string().optional(),
    })
});

export const collections = {
    artworks
};
