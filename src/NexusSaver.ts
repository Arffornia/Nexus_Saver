import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export class NexusSaver {
    private savingFilePath: string;
    private fileName: string;

    constructor(savingFilePath: string, customFileName?: string) {
        this.savingFilePath = savingFilePath;
        this.fileName = customFileName ?? "launcherOptions.json";

        this.initSavingFile();
    }

    private getFullPath(): string {
        return path.join(this.savingFilePath, this.fileName);
    }

    private initSavingFile() {
        const fullPath = this.getFullPath();

        // Check if directory exists, if not, create it
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });  // Create directories recursively
        }

        // If the file doesn't exist, create it with an empty JSON object.
        if (!fs.existsSync(fullPath)) {
            NexusSaver.writeFileAtomic(fullPath, JSON.stringify({}));
        }
    }

    private readData(): Record<string, unknown> {
        return JSON.parse(fs.readFileSync(this.getFullPath(), 'utf-8'));
    }

    private writeData(data: Record<string, unknown>): void {
        NexusSaver.writeFileAtomic(this.getFullPath(), JSON.stringify(data, null, 2));
    }

    /**
     * Writes `content` to a temporary file in the same directory, flushes it to disk, then renames it
     * over `filePath`. A crash mid-write leaves the previous file intact instead of a truncated one.
     */
    private static writeFileAtomic(filePath: string, content: string): void {
        const tmpPath = path.join(
            path.dirname(filePath),
            `.${path.basename(filePath)}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`
        );

        try {
            const fd = fs.openSync(tmpPath, 'w');
            try {
                fs.writeFileSync(fd, content);
                fs.fsyncSync(fd);
            } finally {
                fs.closeSync(fd);
            }
            fs.renameSync(tmpPath, filePath);
        } catch (error) {
            fs.rmSync(tmpPath, { force: true });
            throw error;
        }
    }

    /**
     * Save your variable using the key-value method.
     * If you set a variable that already exists, it will simply overwrite it.
     * The value must be JSON-serialisable.
     *
     * @param {string} key
     * @param {T} value
     * @return {*}  {Promise<void>}
     * @memberof NexusSaver
     */
    public async save<T = string>(key: string, value: T): Promise<void> {
        // Read the current contents of the file
        const data = this.readData();

        // Add or update the key-value pair
        data[key] = value;

        // Write the changes back to the file
        this.writeData(data);
    }

    /**
     * Load your variable using its key.
     * Returns the stored value as is (including `0`, `false` and `''`).
     * If the key doesn't exist, it will return an empty string.
     *
     * @param {string} key
     * @return {*}  {Promise<T | ''>}
     * @memberof NexusSaver
     */
    public async load<T = string>(key: string): Promise<T | ''> {
        // Read the contents of the file
        const data = this.readData();

        // Return the value if the key exists, otherwise return an empty string
        return Object.prototype.hasOwnProperty.call(data, key) ? data[key] as T : '';
    }

    /**
     * Delete a variable using its key.
     * If you try to delete a key that doesn't exist, nothing will happen.
     *
     * @param {string} key
     * @return {*}  {Promise<boolean>}
     * @memberof NexusSaver
     */
    public async delete(key: string): Promise<boolean> {
        // Read the contents of the file
        const data = this.readData();

        // Check if the key exists
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            // Delete the key
            delete data[key];

            // Write the changes back to the file
            this.writeData(data);
            return true;
        } else {
            // If the key doesn't exist, return false
            return false;
        }
    }
}
