import { NexusSaver } from "@src/NexusSaver";
import { makeTmpDir, removeDir } from "./helpers";

describe("load returns stored falsy values", () => {
    let dir: string;
    let saver: NexusSaver;

    beforeEach(() => {
        dir = makeTmpDir();
        saver = new NexusSaver(dir);
    });

    afterEach(() => {
        removeDir(dir);
    });

    it.each([
        ["zero", 0],
        ["false", false],
        ["empty string", ""],
        ["null", null],
    ])("returns %s as stored", async (_label, value) => {
        await saver.save("k", value);
        expect(await saver.load("k")).toStrictEqual(value);
    });

    it("still returns '' for a missing key", async () => {
        expect(await saver.load("missing")).toStrictEqual('');
    });

    it("returns non-string values set by older callers (numbers, objects)", async () => {
        await saver.save("allocatedRam", 4096);
        await saver.save("window", { w: 1280, h: 720 });

        expect(await saver.load<number>("allocatedRam")).toBe(4096);
        expect(await saver.load("window")).toEqual({ w: 1280, h: 720 });
    });

    it("does not return inherited Object properties for unknown keys", async () => {
        expect(await saver.load("toString")).toStrictEqual('');
        expect(await saver.load("constructor")).toStrictEqual('');
    });
});
