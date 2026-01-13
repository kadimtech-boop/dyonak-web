import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

// Default Data
const defaultData = {
    clients: [],
    debts: [],
    expenses: [],
    settings: {
        companyName: 'متجر ديونك',
        currency: 'IQD',
        notifications: true
    },
    users: []
};

// Ensure DB Exists
(async () => {
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
    }
})();

// Simple Mutex Implementation
class Mutex {
    constructor() {
        this.queue = Promise.resolve();
    }

    lock() {
        let release;
        const next = new Promise(resolve => release = resolve);
        const previous = this.queue;
        this.queue = previous.then(() => next);
        return previous.then(() => release);
    }
}

const dbMutex = new Mutex();

const readDB = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        const parsed = JSON.parse(data);
        return { ...defaultData, ...parsed };
    } catch (err) {
        return defaultData;
    }
};

const writeDB = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

export const db = {
    get: readDB,
    update: async (callback) => {
        // Acquire Lock
        const release = await dbMutex.lock();
        try {
            const data = await readDB();
            const newData = await callback(data);
            if (newData) {
                await writeDB(newData);
                return newData;
            }
            return data;
        } finally {
            // Release Lock regardless of success/fail
            release();
        }
    }
};
