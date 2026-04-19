import { describe, expect, it } from 'vitest';

import { koya } from '../index.js';

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

  it('excludes bye games from koya sum but counts bye points toward threshold', () => {
    // 3 players, 3 rounds (odd count — one bye per round):
    // Round 1: A(W) 1-0 B, C bye (1 point)
    // Round 2: B(W) 0-1 C, A bye (1 point)
    // Round 3: A(W) 1-0 C, B bye (1 point)
    // Scores: A=3 (1+1bye+1), B=1 (0+0+1bye), C=1 (1bye+1+0) [corrected below]
    //
    // Actually let's be precise with the result field for byes.
    // A bye where player X gets 1 point: { white: 'X', black: 'X', result: 1 }
    // because result is from white's perspective, and white===black===X → X gets 1.
    //
    // Round 1: A beats B (result=1), C gets a bye (result=1)
    // Round 2: C beats B (result=0, B is white so B gets 0), A gets a bye (result=1)
    // Round 3: A beats C (result=1), B gets a bye (result=1)
    //
    // Scores: A = 1(vs B) + 1(bye) + 1(vs C) = 3
    //         B = 0(vs A) + 0(vs C) + 1(bye) = 1
    //         C = 1(bye) + 1(vs B) + 0(vs A) = 2
    //
    // threshold = 3/2 = 1.5
    // Opponents above threshold: A(3) ≥ 1.5, C(2) ≥ 1.5, B(1) < 1.5
    //
    // koya('A') — opponents: B(1)<1.5, C(2)>=1.5
    //   A vs C: round 3, A(W) 1-0 C → 1 point
    //   = 1
    //
    // koya('C') — opponents: B(1)<1.5, A(3)>=1.5
    //   C vs A: round 3, A(W) 1-0 C → C gets 0
    //   = 0
    //
    // koya('B') — opponents: A(3)>=1.5, C(2)>=1.5
    //   B vs A: round 1, A(W) 1-0 B → B gets 0
    //   B vs C: round 2, B(W) 0-1 C → B gets 0
    //   = 0

    const gamesWithByes: Game[][] = [
      [
        { black: 'B', result: 1, white: 'A' },
        { black: 'C', result: 1, white: 'C' }, // C bye
      ],
      [
        { black: 'C', result: 0, white: 'B' },
        { black: 'A', result: 1, white: 'A' }, // A bye
      ],
      [
        { black: 'C', result: 1, white: 'A' },
        { black: 'B', result: 1, white: 'B' }, // B bye
      ],
    ];

    // C's bye pushes their score to 2 (above 1.5 threshold)
    // Without bye points, C would only have 1 (below threshold)
    expect(koya('A', gamesWithByes)).toBe(1);
    expect(koya('C', gamesWithByes)).toBe(0);
    expect(koya('B', gamesWithByes)).toBe(0);
  });
});
