import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { timingSafeEqual } from 'node:crypto';
import { UserWebhookData } from './types.ts';
import { handleMisskeyWebhook } from './handle.ts';
import { env } from '../env.ts';

export const misskeyWebhook = new Hono();

async function isValidSecret(secret: string | undefined): Promise<boolean> {
    if (secret == null) {
        return false;
    }
    const MISSKEY_HOOK_SECRET = env('MISSKEY_HOOK_SECRET');
    const encoder = new TextEncoder();
    const clientSecret = encoder.encode(secret);
    const serverSecret = encoder.encode(MISSKEY_HOOK_SECRET);
    return timingSafeEqual(
        new DataView(await crypto.subtle.digest('SHA-256', clientSecret)),
        new DataView(await crypto.subtle.digest('SHA-256', serverSecret)),
    );
}

misskeyWebhook.use('*', async (c, next) => {
    const secret = c.req.header('X-Misskey-Hook-Secret');
    if (!await isValidSecret(secret)) {
        throw new HTTPException(403, { message: 'invalid secret' });
    }
    await next();
});

misskeyWebhook.post('/', async (c) => {
    const data: UserWebhookData = await c.req.json();
    return c.json(await handleMisskeyWebhook(data));
});
