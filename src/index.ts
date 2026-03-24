import { BYE_SENTINEL, gamesForPlayer, opponents, score } from './utilities.js';

import type { Game } from './types.js';

function koya(player: string, games: Game[][]): number {
  const threshold = games.length / 2;
  let sum = 0;
  for (const opp of opponents(player, games)) {
    const oppScore = score(opp, games);
    if (oppScore >= threshold) {
      const gamesBetween = gamesForPlayer(player, games).filter(
        (g) =>
          g.black !== BYE_SENTINEL &&
          g.white !== BYE_SENTINEL &&
          (g.white === opp || g.black === opp),
      );
      for (const g of gamesBetween) {
        sum += g.white === player ? g.result : 1 - g.result;
      }
    }
  }
  return sum;
}

export { koya, koya as tiebreak };

export type { Game, GameKind, Player, Result } from './types.js';
