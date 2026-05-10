import { describe, expect, it } from 'vitest';

import { koya } from '../index.js';

import type { CompletedRound, Player } from '@echecs/tournament';

const PLAYERS: Player[] = [
  { id: 'A', points: 2.5, rank: 1 },
  { id: 'B', points: 1, rank: 3 },
  { id: 'C', points: 0, rank: 4 },
  { id: 'D', points: 2.5, rank: 2 },
];

const ROUNDS: CompletedRound[] = [
  {
    byes: [],
    games: [
      { black: 'B', result: 'white', white: 'A' },
      { black: 'D', result: 'black', white: 'C' },
    ],
  },
  {
    byes: [],
    games: [
      { black: 'D', result: 'draw', white: 'A' },
      { black: 'B', result: 'black', white: 'C' },
    ],
  },
  {
    byes: [],
    games: [
      { black: 'C', result: 'white', white: 'A' },
      { black: 'B', result: 'white', white: 'D' },
    ],
  },
];

describe('koya', () => {
  it('returns points scored against opponents with >= 50% of max score', () => {
    expect(koya('A', ROUNDS, PLAYERS)).toBe(0.5);
  });

  it('handles player with no games', () => {
    expect(koya('A', [], PLAYERS)).toBe(0);
  });

  it('returns 0 when no opponent meets the threshold', () => {
    expect(koya('B', ROUNDS, PLAYERS)).toBe(0);
  });

  it('counts bye points toward threshold via Player.points', () => {
    const players: Player[] = [
      { id: 'A', points: 3, rank: 1 },
      { id: 'B', points: 1, rank: 3 },
      { id: 'C', points: 2, rank: 2 },
    ];
    const rounds: CompletedRound[] = [
      {
        byes: [{ kind: 'pairing', player: 'C' }],
        games: [{ black: 'B', result: 'white', white: 'A' }],
      },
      {
        byes: [{ kind: 'pairing', player: 'A' }],
        games: [{ black: 'C', result: 'black', white: 'B' }],
      },
      {
        byes: [{ kind: 'pairing', player: 'B' }],
        games: [{ black: 'C', result: 'white', white: 'A' }],
      },
    ];
    expect(koya('A', rounds, players)).toBe(1);
    expect(koya('C', rounds, players)).toBe(0);
    expect(koya('B', rounds, players)).toBe(0);
  });
});
