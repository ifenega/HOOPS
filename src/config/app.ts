import identity from '../../app.identity.json';

/**
 * Single source of truth for the app's identity, shared with `app.config.ts`
 * (which reads the same JSON). The name is embedded in the bundle identifier,
 * the URL scheme, and the storage-key prefix — changing the app name later is a
 * one-line edit in `app.identity.json`.
 */
export const APP = identity;
