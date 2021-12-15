import { read, zip} from "../utils"

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