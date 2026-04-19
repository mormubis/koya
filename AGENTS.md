# AGENTS.md

Agent guidance for the `@echecs/koya` repository — a TypeScript library
implementing the Koya tiebreak system for round-robin tournaments following FIDE
Tiebreak Regulations (section 9.2).

**See also:** [`REFERENCES.md`](REFERENCES.md) | [`SPEC.md`](SPEC.md)

See the root `AGENTS.md` for workspace-wide conventions.

**Backlog:** tracked in
[GitHub Issues](https://github.com/echecsjs/koya/issues).

---

## Project Overview

Pure calculation library, no runtime dependencies. Exports one function:

| Function | Description                                                             |
| -------- | ----------------------------------------------------------------------- |
| `koya`   | Score against opponents who scored 50 % or more of the maximum possible |

The function conforms to the signature:

```ts
(playerId: string, games: Game[][], players?: Player[]) => number;
```

`Game[][]` is a round-indexed structure: `games[0]` contains round-1 games,
`games[1]` contains round-2 games, and so on. The `Game` type no longer has a
`round` field — round is determined by array position.

The `Game` type carries an optional `kind?: GameKind` field. When present it
identifies the nature of an unplayed round (e.g. `'half-bye'`, `'full-bye'`,
`'forfeit-win'`, `'forfeit-loss'`, `'zero-bye'`, `'pairing-bye'`). When absent,
the game is treated as a normal over-the-board result.

FIDE reference: https://handbook.fide.com/chapter/TieBreakRegulations032026
(section 9.2 — Koya System)

All source lives in `src/index.ts`; tests in `src/__tests__/index.spec.ts`.

---

## Commands

### Build

```bash
pnpm run build          # bundle TypeScript → dist/ via tsdown
```

### Test

```bash
pnpm run test                          # run all tests once
pnpm run test:watch                    # watch mode
pnpm run test:coverage                 # with coverage report

# Run a single test file
pnpm run test src/__tests__/index.spec.ts

# Run a single test by name (substring match)
pnpm run test -- --reporter=verbose -t "koya"
```

### Lint & Format

```bash
pnpm run lint           # ESLint + tsc type-check (auto-fixes style issues)
pnpm run lint:ci        # strict — zero warnings allowed, no auto-fix
pnpm run lint:style     # ESLint only (auto-fixes)
pnpm run lint:types     # tsc --noEmit type-check only
pnpm run format         # Prettier (writes changes)
pnpm run format:ci      # Prettier check only (no writes)
```

### Full pre-PR check

```bash
pnpm lint && pnpm test && pnpm build
```

---

## Architecture Notes

- The Koya score is the sum of points scored by a player **only** in games
  played against opponents who achieved at least 50 % of the maximum possible
  score in the tournament.
- The 50 % threshold is computed across all rounds of the tournament for each
  opponent individually.
- A bye is represented as a `Game` where both sides are the same player
  (`black: player.id, white: player.id`). Bye points **do** count toward a
  player's tournament score for the 50 % threshold calculation, but the bye game
  itself is excluded from the Koya sum (the `g.black !== g.white` filter removes
  it).
- This system is defined specifically for round-robin (all-play-all) tournaments
  but the implementation does not restrict its use to that format.
- **No runtime dependencies** — keep it that way.
- **ESM-only** — the package ships only ESM. Do not add a CJS build.

---

## Tiebreak Signature

All tiebreak functions consumed by `@echecs/tournament` must conform to:

```typescript
(playerId: string, games: Game[], players: Map<string, Player>) => number;
```

---

## Validation

Input validation is provided by TypeScript's strict type system at compile time.
There is no runtime validation library. Do not add runtime type-checking guards
unless there is an explicit trust boundary (user-supplied strings, external
data).

---

## Error Handling

The function is a pure calculation and does not throw. An unplayed tournament
(zero games) returns `0` rather than throwing.
