// ads.txt is generated from ads.client in site.config.ts, so there is only one place to paste the publisher id.
// Ad networks only read it from the root of the domain, so it is only useful once the site is served at "/".
import type { APIRoute } from 'astro';
import { ads } from '../site.config';

export const GET: APIRoute = () => {
  const pub = ads.client.replace(/^ca-/, '');
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# Set ads.client in src/site.config.ts to fill this in.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
