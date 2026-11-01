# Nexus Saver

`@arffornia/nexus_saver` stores key/value settings in a JSON file on disk (`save`, `load`, `delete`).
It is part of the Arffornia ecosystem: the [Arffornia launcher](https://github.com/Arffornia/Arffornia_Launcher_V.5.2)
uses it for player settings (language, RAM) and the Microsoft session. Architecture docs (coming soon):
https://arffornia.github.io/docs/

## Requirements

- Node.js 22 (CI runs on 22)

## Install

```bash
npm i @arffornia/nexus_saver
```

## Usage

```ts
import { NexusSaver } from '@arffornia/nexus_saver';

// Directory of the save file, and optional file name (default: launcherOptions.json).
// The directory and an empty `{}` file are created if missing.
const saver = new NexusSaver('./.myapp', 'settings.json');

await saver.save('lang', 'en');        // add or overwrite a key
const lang = await saver.load('lang'); // value, or '' if the key does not exist
await saver.delete('lang');            // true if the key existed, false otherwise
```

Values are stored as plain JSON (pretty-printed). Do not store secrets without encrypting them first.

## Commands

| Command | What it does |
|---|---|
| `npm ci` | Install the exact dependency tree from `package-lock.json` |
| `make check` | Type-check, run the tests, build (what CI runs) |
| `make test` / `npm test` | Run the Jest tests |
| `make build` / `npm run build` | Compile to `dist/` (`tsc` + `tsc-alias`) |

## Configuration

None. The directory and file name are constructor arguments. No environment variables are read.

## Release process

Releases are done by the maintainer; contributors never publish.

1. Bump `version` in `package.json` (and the lockfile: `npm version <x.y.z> --no-git-tag-version`) in a PR, merge it.
2. Tag the merge commit on `main` and push the tag: `git tag v<x.y.z> && git push origin v<x.y.z>`.
3. `.github/workflows/publish.yml` checks that the tag matches `package.json`, runs `make check` and runs
   `npm publish --provenance`. No token: it uses npm **trusted publishing** (the workflow proves who it is to
   npm with a short-lived GitHub OIDC identity; nothing is stored, nothing to rotate).

One-time setup on npmjs.com (owner, per package): open https://www.npmjs.com/package/@arffornia/nexus_saver/access ,
section **Trusted Publisher** > **GitHub Actions**, and enter: organization or user `Arffornia`, repository
`Nexus_Saver`, workflow filename `publish.yml`, environment empty. Then delete any old `NPM_TOKEN` secret in the repo
settings. A package that was never published needs one first manual `npm publish` before a trusted publisher can be
attached.

## License

MIT, see [LICENSE](LICENSE).
