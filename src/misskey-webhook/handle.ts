import { api } from 'misskey-js';
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
    console.log('webhook', data);
    const MISSKEY_REPOST_HOST = env('MISSKEY_REPOST_HOST');
    const MISSKEY_REPOST_TOKEN = env('MISSKEY_REPOST_TOKEN');
    const client = new api.APIClient({
        origin: MISSKEY_REPOST_HOST,
        credential: MISSKEY_REPOST_TOKEN,
    });
    const uri = `${data.server}/notes/${note.id}`;
    const lookedUp = await client.request('ap/show', { uri });
    console.log('looked up', lookedUp);
    if (lookedUp.type != 'Note') {
        throw new TypeError('expected note');
    }
    await client.request('notes/create', { renoteId: lookedUp.object.id });
}
