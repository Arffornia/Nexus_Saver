import { NexusSaver } from "@src/NexusSaver";

describe("Delete keys", () => {
    beforeAll(async () => {
        // Do something before all tests of this file
    });

    afterAll(async () => {
        // Do something after all tests of this file
    }, 1 * 1000); // You also can set a different timeout


    const data1 = "Hello world";
    const data2 = "Bye";

    const keyName = "simpleDeleteTest";


     it("Simple key deletetion", async () => {
        const savingFilePath = "./.minecraft/";
        const saver = new NexusSaver(savingFilePath);

        saver.save(keyName, data1);
        const dataSaved1 = await saver.load(keyName);

        saver.delete(keyName);
        const dataSaved2 = await saver.load(keyName);
        
        // Check the test result
        expect(dataSaved1).toEqual(data1);
        expect(dataSaved2).toEqual('');
    });
});