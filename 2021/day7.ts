import { read } from "../utils"

const allCosts = (crabs: number[], fuelCost: (distance: number) => number): number[] => {
    const max = Math.max(...crabs);
    const positions = [...Array(max).keys()]
    return positions.map(pos => {
        return crabs.reduce((acc, cur) =>  acc + fuelCost(Math.abs(cur - pos)), 0)
    })
}

const linearCost = (distance: number): number => distance;
const additiveCost = (distance: number): number => distance * (distance + 1) / 2;

const solve = (input: string, fuelCost: (distance: number) => number): number => {
    const crabs = input.split(",").map(x => +x);
    const costs = allCosts(crabs, fuelCost);
    return Math.min(...costs);
}

const part1 = (input: string): number => solve(input, linearCost);
const part2 = (input: string): number => solve(input, additiveCost);

read(2021, 7).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));