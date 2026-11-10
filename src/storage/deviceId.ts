import { generateId } from './ids';
import { KEYS, storage } from './mmkv-storage';

/**
 * The device UUID is generated once and persisted. In Phase 4 it is what lets
 * the host restore a reconnecting device's owned modules automatically.
 */
export function getDeviceId(): string {
  const existing = storage.getString(KEYS.deviceId);
  if (existing) return existing;
  const created = generateId();
  storage.set(KEYS.deviceId, created);
  return created;
}
