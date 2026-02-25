import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artworks = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/artworks" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    image: z.string(),
    medium: z.string().optional(),
    dimensions: z.string().optional(),
    year: z.string().optional(),
    status: z.string().default('available'),
    description: z.string().optional(),
  }),
});

export const collections = { artworks };
