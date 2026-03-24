import {
  BYE_SENTINEL,
  gamesForPlayer,
  opponentIds,
  score,
} from './utilities.js';

import type { Game } from './types.js';

function koya(playerId: string, games: Game[][]): number {
  const threshold = games.length / 2;
  let sum = 0;
  for (const oppId of opponentIds(playerId, games)) {
    const oppScore = score(oppId, games);
    if (oppScore >= threshold) {
      const gamesBetween = gamesForPlayer(playerId, games).filter(
        (g) =>
          g.black !== BYE_SENTINEL &&
          g.white !== BYE_SENTINEL &&
          (g.white === oppId || g.black === oppId),
      );
      for (const g of gamesBetween) {
        sum += g.white === playerId ? g.result : 1 - g.result;
      }
    }
  }
  return sum;
}

export { koya };

export type { Game, Player, Result } from './types.js';
