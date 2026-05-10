import { gamesForPlayer, opponents, scoreFor } from './utilities.js';

import type { CompletedRound, Player } from '@echecs/tournament';

function koya(
  player: string,
  rounds: CompletedRound[],
  players: Player[],
): number {
  const threshold = rounds.length / 2;
  let sum = 0;
  for (const opp of opponents(player, rounds)) {
    const opponent = players.find((p) => p.id === opp);
    if (opponent === undefined || opponent.points < threshold) {
      continue;
    }
    const gamesBetween = gamesForPlayer(player, rounds).filter(
      (g) => g.white === opp || g.black === opp,
    );
    for (const g of gamesBetween) {
      sum += scoreFor(player, g);
    }
  }
  return sum;
}

export { koya, koya as tiebreak };

export type {
  Bye,
  CompletedRound,
  Game,
  Pairing,
  Player,
} from '@echecs/tournament';
