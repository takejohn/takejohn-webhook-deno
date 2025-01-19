import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { misskeyWebhook } from './misskey-webhook/route.ts';

const app = new Hono();
app.use(logger());
app.route('/api/misskey-webhook', misskeyWebhook);
export default { fetch: app.fetch };
