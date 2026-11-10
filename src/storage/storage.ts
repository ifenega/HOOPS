/**
 * Synchronous key/value persistence. The interface exists so /core stays
 * storage-agnostic and the future web PWA can swap MMKV for another backend.
 */
export interface Storage {
  getString(key: string): string | null;
  set(key: string, value: string): void;
  delete(key: string): void;
  contains(key: string): boolean;
}
