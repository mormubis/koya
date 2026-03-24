import { describe, expect, it } from 'vitest';

import { koya } from '../functions.js';

import type { Game } from '../types.js';

// 4 players, 3 rounds:
// Round 1: A(W) 1-0 B, C(W) 0-1 D
// Round 2: A(W) 0.5-0.5 D, C(W) 0-1 B
// Round 3: A(W) 1-0 C, D(W) 1-0 B
// Scores: A=2.5, D=2.5, B=1, C=0
// games.length=3, threshold=1.5
// Players with >= 1.5 points: A(2.5), D(2.5)

const GAMES: Game[][] = [
  [
    { black: 'B', result: 1, white: 'A' },
    { black: 'D', result: 0, white: 'C' },
  ],
  [
    { black: 'D', result: 0.5, white: 'A' },
    { black: 'B', result: 0, white: 'C' },
  ],
  [
    { black: 'C', result: 1, white: 'A' },
    { black: 'B', result: 1, white: 'D' },
  ],
];

describe('koya', () => {
  it('returns points scored against opponents with >= 50% of max score', () => {
    // threshold = 3/2 = 1.5
    // A's opponents: B(1) < 1.5, D(2.5) >= 1.5, C(0) < 1.5
    // Only D qualifies; A drew D → 0.5
    expect(koya('A', GAMES)).toBe(0.5);
  });

  it('handles player with no games', () => {
    expect(koya('A', [])).toBe(0);
  });

  it('returns 0 when no opponent meets the threshold', () => {
    // B's opponents: A(2.5)>=1.5, C(0)<1.5, D(2.5)>=1.5
    // B scored 0 vs A, 1 vs C (C<threshold), 0 vs D → 0
    expect(koya('B', GAMES)).toBe(0);
  });
});
