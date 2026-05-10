import type { CompletedRound, Game } from '@echecs/tournament';

function gamesForPlayer(player: string, rounds: CompletedRound[]): Game[] {
  return rounds
    .flatMap((r) => r.games)
    .filter((g) => g.white === player || g.black === player);
}

function opponents(player: string, rounds: CompletedRound[]): string[] {
  return gamesForPlayer(player, rounds).map((g) =>
    g.white === player ? g.black : g.white,
  );
}

function scoreFor(player: string, game: Game): number {
  if (game.result === 'draw') {
    return 0.5;
  }
  if (game.result === 'none') {
    return 0;
  }
  return (game.result === 'white' && game.white === player) ||
    (game.result === 'black' && game.black === player)
    ? 1
    : 0;
}

export { gamesForPlayer, opponents, scoreFor };
