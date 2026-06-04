
export const GAME_CONFIG = {
  SPAWN_INTERVAL_MS: 500,
  ITEM_PROBABILITY: 0.7,
  COUNTDOWN_MS: 3_000,
  MIN_PLAY_MS: 3_000,
  CATCH_BUFFER: 5,
  ABSOLUTE_MAX_SCORE: 300,
  PAYOUT_THRESHOLD: 100,
  
  // Falling-item speed ramp. Items start at BASE and gain INCREMENT per catch
  ITEM_BASE_SPEED_PX_PER_SEC: 300,
  ITEM_SPEED_INCREMENT_PER_CATCH: 4,
} as const;

 /**
  * Returns an estimated upper bound for the score a player could have caught
  * after `elapsedMs`.
  *
  * The calculation ignores the initial countdown (`COUNTDOWN_MS`), estimates
  * spawn opportunities using `SPAWN_INTERVAL_MS`, converts those spawns to
  * catchable items using `ITEM_PROBABILITY`, and then adds `CATCH_BUFFER`.
  */
export function maxCatchableScore(elapsedMs: number): number {
  const playMs = elapsedMs - GAME_CONFIG.COUNTDOWN_MS;
  if (playMs <= 0) return 0;
  const spawns = Math.ceil(playMs / GAME_CONFIG.SPAWN_INTERVAL_MS);
  const items = Math.ceil(spawns * GAME_CONFIG.ITEM_PROBABILITY);
  return items + GAME_CONFIG.CATCH_BUFFER;
}
