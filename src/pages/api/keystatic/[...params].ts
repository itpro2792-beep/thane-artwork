import { makeAPIRouteHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

export const all = makeAPIRouteHandler({
    config: keystaticConfig,
});
