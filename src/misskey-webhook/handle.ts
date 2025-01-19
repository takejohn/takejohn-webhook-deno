import { UserWebhookData } from './types.ts';

export async function handleMisskeyWebhook(
    data: UserWebhookData,
): Promise<null> {
    console.log(data);
    return null;
}
