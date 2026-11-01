import fs from 'fs';
import path from 'path';
import { NexusSaver } from "@src/NexusSaver";
import { makeTmpDir, removeDir } from "./helpers";

describe("Read and write into the saved file", () => {
    let dir: string;

    beforeEach(() => {
        dir = makeTmpDir();
    });

    afterEach(() => {
        removeDir(dir);
    });

    const data1 = "Hello world";
    const data2 = "Bye";

    it("creates the directory and an empty JSON file", () => {
        const nested = path.join(dir, "a", "b");
        new NexusSaver(nested);

        expect(JSON.parse(fs.readFileSync(path.join(nested, "launcherOptions.json"), "utf-8"))).toEqual({});
    });

    it("uses a custom file name", async () => {
        const saver = new NexusSaver(dir, "custom.json");
        await saver.save("k", "v");

        expect(JSON.parse(fs.readFileSync(path.join(dir, "custom.json"), "utf-8"))).toEqual({ k: "v" });
    });

    it("Write a value, and read them", async () => {
        const saver = new NexusSaver(dir);

        await saver.save("msg", data1);
        const dataSaved1 = await saver.load("msg");

        await saver.save("msg", data2);
        const dataSaved2 = await saver.load("msg");

        expect(dataSaved1).toEqual(data1);
        expect(dataSaved2).toEqual(data2);
    });

    it("Write multiples values and read them", async () => {
        const saver = new NexusSaver(dir);

        await saver.save("msg", data1);
        await saver.save("another msg", data2);

        expect(await saver.load("msg")).toEqual(data1);
        expect(await saver.load("another msg")).toEqual(data2);
    });

    it("persists across instances", async () => {
        await new NexusSaver(dir).save("lang", "fr");

        expect(await new NexusSaver(dir).load("lang")).toEqual("fr");
    });

    it("returns an empty string for a missing key", async () => {
        expect(await new NexusSaver(dir).load("missing")).toEqual('');
    });
});
