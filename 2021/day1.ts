import { read } from "../utils"

const zip = <T>(lists: T[][]): T[][] => {
    const size = lists.reduce((acc, list) => Math.min(acc, list.length), lists[0].length);

    let zipped_list: T[][] = [];
    for (let i = 0; i < size; i++) {
        const entry = lists.map(list => list[i]);
        zipped_list.push(entry);
    }
    return zipped_list;
}

const numOfIncreses = (depths: number[]) => {
    const pairs = zip([
        [...depths], 
        [...depths].splice(1, depths.length)
    ]);

    const dxs = pairs.map(([a, b]) => a - b);

    return dxs.reduce((acc, dx) => dx < 0 ? acc + 1 : acc, 0);
}

export const part1 = (input: string): number => {
    const depths = input.split("\r\n").map(line => parseInt(line));
    return numOfIncreses(depths);
}

export const part2 = (input: string): number => {
    const depths = input.split("\r\n").map(line => parseInt(line));
    
    const windows = zip([
        [...depths], 
        [...depths].splice(1, depths.length),
        [...depths].splice(2, depths.length)
    ]);

    
    const sums = windows.map(([a, b, c]) => a + b + c);
    return numOfIncreses(sums);
}

read(2021, 1).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));