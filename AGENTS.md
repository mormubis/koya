# AGENTS.md

Agent guidance for the `@echecs/koya` repository — a TypeScript library
implementing the Koya tiebreak system for round-robin tournaments following FIDE
Tiebreak Regulations (section 9.2).

See the root `AGENTS.md` for workspace-wide conventions.

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
- A `Game` with `black: ''` (empty string) represents a **bye**. Byes do not
  count toward an opponent's score for the threshold calculation, and the bye
  game itself is excluded from the Koya sum.
- This system is defined specifically for round-robin (all-play-all) tournaments
  but the implementation does not restrict its use to that format.
- **No runtime dependencies** — keep it that way.
- **ESM-only** — the package ships only ESM. Do not add a CJS build.

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
