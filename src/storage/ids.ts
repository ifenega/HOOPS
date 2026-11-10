import { GAME_CODE } from '../config/constants';

/**
 * UUID v4 for local identifiers (device id, event id, game id). Lives outside
 * /core because it is non-deterministic; /core factories take an id as an
 * argument instead.
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/** A game code from the ambiguity-free alphabet (spec §6). */
export function generateGameCode(): string {
  const { LENGTH, ALPHABET } = GAME_CODE;
  let code = '';
  for (let i = 0; i < LENGTH; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
