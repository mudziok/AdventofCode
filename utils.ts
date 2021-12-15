import fs from "fs/promises";

export const read = async (year: number, day: number): Promise<string> => {
    const path = `resources\\${year}\\day${day}.txt`;
    return fs.readFile(path, 'utf-8');
};

export const transpose = <T>(raport: T[][]) => {
    return raport[0].map((_, col) => raport.map(row => row[col]));
}

export const zip = <T>(lists: T[][]): T[][] => {
    const size = lists.reduce((acc, list) => Math.min(acc, list.length), lists[0].length);

    let zipped_list: T[][] = [];
    for (let i = 0; i < size; i++) {
        const entry = lists.map(list => list[i]);
        zipped_list.push(entry);
    }
    return zipped_list;
}