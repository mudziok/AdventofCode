import fs from "fs/promises";

export const read = async (year: number, day: number): Promise<string> => {
    const path = `resources\\${year}\\day${day}.txt`;
    return fs.readFile(path, 'utf-8');
};

export const transpose = <T>(raport: T[][]) => {
    return raport[0].map((_, col) => raport.map(row => row[col]));
}