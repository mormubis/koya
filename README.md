# Koya

[![npm](https://img.shields.io/npm/v/@echecs/koya)](https://www.npmjs.com/package/@echecs/koya)
[![Coverage](https://codecov.io/gh/mormubis/koya/branch/main/graph/badge.svg)](https://codecov.io/gh/mormubis/koya)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Koya** is a TypeScript library implementing the Koya tiebreak system for
round-robin chess tournaments, following the
[FIDE Tiebreak Regulations](https://handbook.fide.com/chapter/TieBreakRegulations032026)
(section 9.2). Zero runtime dependencies.

## Installation

```bash
npm install @echecs/koya
```

## Quick Start

```typescript
import { koya } from '@echecs/koya';
import type { Game, GameKind } from '@echecs/koya';

// games[n] = round n+1; Game has no `round` field
const games: Game[][] = [
  [{ black: 'B', result: 1, white: 'A' }], // round 1
  [{ black: 'C', result: 0.5, white: 'A' }], // round 2
  [{ black: 'A', result: 0, white: 'D' }], // round 3
  // Unplayed rounds use kind to classify the bye type
  [{ black: '', kind: 'half-bye', result: 0.5, white: 'A' }], // round 4
];

const score = koya('A', games);
// Returns points scored against opponents who achieved >= 50% of the maximum score
```

## API

### `koya(playerId, games, players?)`

**FIDE section 9.2** — Koya score. Returns the total points scored by `playerId`
only in games played against opponents who achieved at least 50% of the maximum
possible score in the tournament. Designed for round-robin (all-play-all)
tournaments. Byes are excluded from both the threshold calculation and the score
sum. Round is determined by array position: `games[0]` = round 1, `games[1]` =
round 2, etc. The `Game` type has no `round` field. The optional
`kind?: GameKind` field on `Game` identifies unplayed rounds; byes are excluded
regardless of kind.

```typescript
koya(playerId: string, games: Game[][], players?: Player[]): number
```

## Contributing

Contributions are welcome. Please open an issue at
[github.com/mormubis/koya/issues](https://github.com/mormubis/koya/issues).
