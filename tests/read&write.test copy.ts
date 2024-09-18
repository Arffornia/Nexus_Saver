import { NexusSaver } from "@src/NexusSaver";

describe("Read and write into the saved file", () => {
    beforeAll(async () => {
        // Do something before all tests of this file
    });

    afterAll(async () => {
        // Do something after all tests of this file
    }, 1 * 1000); // You also can set a different timeout


    const data1 = "Hello world";
    const data2 = "Bye";


     it("Write a value, and read them", async () => {
        const savingFilePath = "./.minecraft/";
        const saver = new NexusSaver(savingFilePath);

        saver.save("msg", data1);
        const dataSaved1 = await saver.load("msg");

        saver.save("msg", data2);
        const dataSaved2 = await saver.load("msg");
        
        // Check the test result
        expect(dataSaved1).toEqual(data1);
        expect(dataSaved2).toEqual(data2);
    });

   it("Write multiples values and read them", async () => {
        const savingFilePath = "./.minecraft/";
        const saver = new NexusSaver(savingFilePath);

        saver.save("msg", data1);
        const dataSaved1 = await saver.load("msg");

        saver.save("another msg", data2);
        const dataSaved2 = await saver.load("another msg");
        
        // Check the test result
        expect(dataSaved1).toEqual(data1);
        expect(dataSaved2).toEqual(data2);
    });
});