
export const GAME_CONFIG = {
  SPAWN_INTERVAL_MS: 500,
  ITEM_PROBABILITY: 0.7,
  COUNTDOWN_MS: 3_000,
  MIN_PLAY_MS: 1_000,
  CATCH_BUFFER: 5,
  ABSOLUTE_MAX_SCORE: 300,
} as const;


// maxCatchableScore possible
export function maxCatchableScore(elapsedMs: number): number {
  const playMs = Math.max(0, elapsedMs - GAME_CONFIG.COUNTDOWN_MS);
  const spawns = Math.ceil(playMs / GAME_CONFIG.SPAWN_INTERVAL_MS);
  const items = Math.ceil(spawns * GAME_CONFIG.ITEM_PROBABILITY);
  return items + GAME_CONFIG.CATCH_BUFFER;
}
