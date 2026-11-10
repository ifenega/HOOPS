import { createMMKV } from 'react-native-mmkv';

import { APP } from '../config/app';
import type { Storage } from './storage';

const mmkv = createMMKV({ id: `${APP.storagePrefix}-store` });

function prefixed(key: string): string {
  return `${APP.storagePrefix}:${key}`;
}

/** Key suffixes (spec §12). The `storagePrefix` is applied in `prefixed`. */
export const KEYS = {
  deviceId: 'device:id',
  activeGame: 'game:active',
  game: (gameId: string): string => `game:${gameId}`,
  gameIndex: 'game:index',
  savedTeams: 'teams:saved',
} as const;

export const storage: Storage = {
  getString(key) {
    return mmkv.getString(prefixed(key)) ?? null;
  },
  set(key, value) {
    mmkv.set(prefixed(key), value);
  },
  delete(key) {
    mmkv.remove(prefixed(key));
  },
  contains(key) {
    return mmkv.contains(prefixed(key));
  },
};
