import fs from 'fs';
import path from 'path';
import { NexusSaver } from "@src/NexusSaver";
import { makeTmpDir, removeDir } from "./helpers";

describe("Atomic writes", () => {
    let dir: string;
    const file = () => path.join(dir, "launcherOptions.json");
    const readFile = () => JSON.parse(fs.readFileSync(file(), "utf-8"));

    beforeEach(() => {
        dir = makeTmpDir();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        removeDir(dir);
    });

    it("writes pretty-printed JSON and leaves no temp file", async () => {
        const saver = new NexusSaver(dir);
        await saver.save("lang", "en");
        await saver.save("allocatedRam", "4");
        await saver.delete("allocatedRam");

        expect(fs.readFileSync(file(), "utf-8")).toEqual(JSON.stringify({ lang: "en" }, null, 2));
        expect(fs.readdirSync(dir)).toEqual(["launcherOptions.json"]);
    });

    it("keeps the previous file intact when the process dies before the rename", async () => {
        const saver = new NexusSaver(dir);
        await saver.save("refresh-token", "keep-me");

        jest.spyOn(fs, "renameSync").mockImplementation(() => { throw new Error("crash before rename"); });

        await expect(saver.save("lang", "fr")).rejects.toThrow("crash before rename");

        expect(readFile()).toEqual({ "refresh-token": "keep-me" });
        expect(fs.readdirSync(dir)).toEqual(["launcherOptions.json"]);
    });

    it("keeps the previous file intact when writing the temp file fails midway", async () => {
        const saver = new NexusSaver(dir);
        await saver.save("refresh-token", "keep-me");

        const realWrite = fs.writeFileSync;
        jest.spyOn(fs, "writeFileSync").mockImplementation((target, data, options) => {
            // simulate a partial write, then a failure (disk full, power loss...)
            realWrite(target as number, String(data).slice(0, 5), options as fs.WriteFileOptions);
            throw new Error("ENOSPC");
        });

        await expect(saver.delete("refresh-token")).rejects.toThrow("ENOSPC");

        expect(readFile()).toEqual({ "refresh-token": "keep-me" });
        expect(fs.readdirSync(dir)).toEqual(["launcherOptions.json"]);
    });

    it("never writes the target file in place", async () => {
        const saver = new NexusSaver(dir);
        const writeSpy = jest.spyOn(fs, "writeFileSync");

        await saver.save("k", "v");

        for (const [target] of writeSpy.mock.calls) {
            expect(target).not.toEqual(file());
        }
    });
});
