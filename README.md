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

Releases are done by the maintainer: bump `version` in `package.json` in a PR, merge, then publish the merged
commit to npm and tag it `v<version>`. Contributors never publish.

## License

MIT, see [LICENSE](LICENSE).
