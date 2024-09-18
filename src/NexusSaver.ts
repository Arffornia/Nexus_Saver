import * as fs from 'fs';
import * as path from 'path';

export class NexusMods {
    private savingFilePath: string;
    private fileName: string;

    constructor(savingFilePath: string, customFileName?: string) {
        this.savingFilePath = savingFilePath;
        this.fileName = customFileName ?? "launcherOptions.json";

        this.initSavingFile();
    }

    private initSavingFile() {
        const fullPath = path.join(this.savingFilePath, this.fileName);
        // If the file doesn't exist, create it with an empty JSON object.
        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, JSON.stringify({}));
        }
    }

    /**
     * Save your variable using the key-value method.
     * If you set a variable that already exists, it will simply overwrite it.
     *
     * @param {string} key
     * @param {string} value
     * @return {*}  {Promise<void>}
     * @memberof NexusMods
     */
    public async save(key: string, value: string): Promise<void> {
        const fullPath = path.join(this.savingFilePath, this.fileName);
        
        // Read the current contents of the file
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        // Add or update the key-value pair
        data[key] = value;

        // Write the changes back to the file
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    }

    /**
     * Load your variable using its key.
     * If the key doesn't exist, it will return an empty string.
     *
     * @param {string} key
     * @return {*}  {Promise<string>}
     * @memberof NexusMods
     */
    public async load(key: string): Promise<string> {
        const fullPath = path.join(this.savingFilePath, this.fileName);

        // Read the contents of the file
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        // Return the value if found, otherwise return an empty string
        return data[key] || '';
    }

    /**
     * Delete a variable using its key.
     * If you try to delete a key that doesn't exist, nothing will happen.
     * 
     * @param {string} key
     * @return {*}  {Promise<boolean>}
     * @memberof NexusMods
     */
    public async delete(key: string): Promise<boolean> {
        const fullPath = path.join(this.savingFilePath, this.fileName);

        // Read the contents of the file
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        // Check if the key exists
        if (data.hasOwnProperty(key)) {
            // Delete the key
            delete data[key];

            // Write the changes back to the file
            fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
            return true;
        } else {
            // If the key doesn't exist, return false
            return false;
        }
    }
}
