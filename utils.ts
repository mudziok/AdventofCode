import fs from "fs/promises";

export const read = async (year: number, day: number): Promise<string> => {
    const path = `resources\\${year}\\day${day}.txt`;
    return fs.readFile(path, 'utf-8');
};