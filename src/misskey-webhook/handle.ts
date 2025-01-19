import { api } from 'misskey-js';
import { setTimeout } from 'node:timers/promises';
import { env } from '../env.ts';
import { UserWebhookData } from './types.ts';

export async function handleMisskeyWebhook(
    data: UserWebhookData,
): Promise<null> {
    switch (data.type) {
        case 'note': {
            await handleMisskeyNoteWebhook(data as UserWebhookData<'note'>);
        }
    }
    return null;
}

async function handleMisskeyNoteWebhook(
    data: UserWebhookData<'note'>,
): Promise<void> {
    const note = data.body.note;
    if (note.renoteId) {
        return;
    }
    const MISSKEY_REPOST_HOST = env('MISSKEY_REPOST_HOST');
    const MISSKEY_REPOST_TOKEN = env('MISSKEY_REPOST_TOKEN');
    const client = new api.APIClient({
        origin: MISSKEY_REPOST_HOST,
        credential: MISSKEY_REPOST_TOKEN,
    });
    const renoteId = note.id;
    console.log('renoteId', renoteId);
    await setTimeout(1000);
    await client.request('notes/create', { renoteId });
}
