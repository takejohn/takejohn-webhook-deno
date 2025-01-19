type EnvKey =
    | 'MISSKEY_HOOK_SECRET'
    | 'MISSKEY_REPOST_HOST'
    | 'MISSKEY_REPOST_TOKEN';

export function env(key: EnvKey): string {
    const value = Deno.env.get(key);
    if (value == null) {
        throw new TypeError(`Environment variable ${key} is not defined`);
    }
    return value;
}
