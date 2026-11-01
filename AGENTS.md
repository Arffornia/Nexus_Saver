# AGENTS.md — Nexus_Saver

Guide for AI agents and newcomers. Read it before changing anything.

## Purpose

TypeScript library published to npm as `@arffornia/nexus_saver`. `NexusSaver` keeps key/value pairs in one JSON
file (`<dir>/launcherOptions.json` by default). Main consumer: the Arffornia launcher
(`Arffornia/Arffornia_Launcher_V.5.2`, `src/main/ipcHandlers/nexusSaverHandler.js`, `src/main/msAuthManager.js`),
which stores settings and the Microsoft refresh token in it. Losing or corrupting the file logs the player out
and resets their settings.

## Repo map

| Path | What |
|---|---|
| `src/index.ts` | Public exports |
| `src/NexusSaver.ts` | The saver (`save`, `load`, `delete`) |
| `tests/*.test.ts` | Jest tests (`@src/*` maps to `src/*`, see `jest.config.js`) |
| `dist/` | Build output (ignored; `main` is `dist/index.js`) |

## Commands

```bash
npm ci          # install (lockfile is committed)
make check      # tsc --noEmit + jest + build — must pass before any PR
make test       # jest only
make build      # tsc && tsc-alias -> dist/
```

## Conventions

- English everywhere (code, comments, docs, commits, PRs).
- Conventional Commits; one PR per issue; PR body: What / Why / How it was tested / Risk & revert.
- Keep the public API backward compatible: constructor `(dir, fileName?)`, `save(key, value)`, `load(key)`
  (returns `''` for a missing key), `delete(key)` (returns a boolean). All are `async`.
- Do not bump `version` or publish: the maintainer releases.

## Hard rules

- Never replace this library (or Nexus_Java / Nexus_Logger / Nexus_Mods) with a third-party one. Improve it.
- Never commit secrets. Never merge, tag, publish or push to `main`.
- Behaviour changes need an issue.

## Testing strategy

- Use `makeTmpDir()` / `removeDir()` from `tests/helpers.ts`; never write into the repo (`.minecraft/` is ignored).
- Test files must end in `.test.ts` or Jest will not run them.
- Always `await` `save`/`delete` in tests.

## Gotchas (from the 2026-10-29 audit)

- Writes rewrite the file in place (no temp file + rename), so a crash mid-write corrupts every setting.
- `load` returns `data[key] || ''`, so `0` and `false` read back as `''`.
- The API is `async` but uses synchronous I/O.
- Values are plaintext; encryption of the token is a launcher concern (Electron `safeStorage`).

## Related repos

- `Arffornia/Arffornia_Launcher_V.5.2` (consumer)
- `Arffornia/Nexus_Java`, `Arffornia/Nexus_Logger`, `Arffornia/Nexus_Mods` (sibling libraries)
