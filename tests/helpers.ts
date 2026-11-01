import fs from 'fs';
import os from 'os';
import path from 'path';

/** Creates an isolated temp dir for a test. Never write into the repo. */
export function makeTmpDir(prefix = 'nexus-saver-'): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function removeDir(dir: string): void {
    fs.rmSync(dir, { recursive: true, force: true });
}
