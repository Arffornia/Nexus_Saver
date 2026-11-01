import { NexusSaver } from "@src/NexusSaver";
import { makeTmpDir, removeDir } from "./helpers";

describe("Delete keys", () => {
    let dir: string;

    beforeEach(() => {
        dir = makeTmpDir();
    });

    afterEach(() => {
        removeDir(dir);
    });

    const data1 = "Hello world";
    const keyName = "simpleDeleteTest";

    it("Simple key deletion", async () => {
        const saver = new NexusSaver(dir);

        await saver.save(keyName, data1);
        const dataSaved1 = await saver.load(keyName);

        expect(await saver.delete(keyName)).toBe(true);
        const dataSaved2 = await saver.load(keyName);

        expect(dataSaved1).toEqual(data1);
        expect(dataSaved2).toEqual('');
    });

    it("returns false when the key does not exist", async () => {
        const saver = new NexusSaver(dir);
        await saver.save("other", "x");

        expect(await saver.delete(keyName)).toBe(false);
        expect(await saver.load("other")).toEqual("x");
    });
});
