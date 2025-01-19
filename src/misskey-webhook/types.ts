import type { entities } from 'misskey-js';

export type WebhookEventTypes =
    | 'mention'
    | 'unfollow'
    | 'follow'
    | 'followed'
    | 'note'
    | 'reply'
    | 'renote'
    | 'reaction';

export type UserWebhookPayload<T extends WebhookEventTypes> = T extends
    'note' | 'reply' | 'renote' | 'mention' ? { note: entities.Note }
    : T extends 'follow' | 'unfollow' ? { user: entities.User }
    : T extends 'followed' ? { user: entities.UserLite }
    : never;

export interface UserWebhookData<
    T extends WebhookEventTypes = WebhookEventTypes,
> {
    server: string;
    hookId: string;
    userId: string;
    eventId: string;
    createdAt: number;
    type: T;
    body: UserWebhookPayload<T>;
}
