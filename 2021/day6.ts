import { read } from "../utils"

const afterDays = (counted: number[], days: number): number[] => {
    if (days == 0) return counted;

    const last = afterDays(counted, days - 1);
    const current = last.map((_, i) => {
        if (i == 6) return last[0] + last[7];
        if (i == 8) return last[0];
        return last[i + 1];
    });
    return current;
}

const solve = (input: string, days: number): number => {
    const fish = input.split(",").map(x => +x);
    const counted = fish.reduce((acc, cur) => {
        acc[cur]++;
        return acc;
    }, Array(9).fill(0));

    return afterDays(counted, days).reduce((acc, cur) => acc + cur, 0);
}

const part1 = (input: string): number => solve(input, 80);
const part2 = (input: string): number => solve(input, 256);

read(2021, 6).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));