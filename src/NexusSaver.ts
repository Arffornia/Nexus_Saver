export class NexusMods {
    private saveFilePath: string;
    private fileName: string;

    constructor(saveFilePath: string, customFileName?: string) {
        this.saveFilePath = saveFilePath;
        this.fileName = customFileName ?? "launcherOptions.txt";
    }

    /**
     *
     *
     * @param {string} key
     * @param {string} value
     * @return {*}  {Promise<void>}
     * @memberof NexusMods
     */
    public async save(key: string, value: string): Promise<void> {
        // TODO
    }

    /**
     *
     *
     * @param {string} key
     * @return {*}  {Promise<string>}
     * @memberof NexusMods
     */
    public async load(key: string): Promise<string> {
        // TODO
        return "";
    }

    /**
     *
     *
     * @param {string} key
     * @return {*}  {Promise<boolean>}
     * @memberof NexusMods
     */
    public async delete(key: string): Promise<boolean> {
        return false;
    }
}