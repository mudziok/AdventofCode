import { read } from "../utils"

interface probe { x: number, y: number }
interface range { lowerBound: number, upperBound: number }

const rangeArray = (size: number): number[] => Array(size).fill(0).map((_,i) => i);
const isInRange = (value: number, range: range): boolean => range.lowerBound <= value && value <= range.upperBound;
const isInArea = (probe: probe, areaX: range, areaY: range): boolean => isInRange(probe.x, areaX) && isInRange(probe.y, areaY);

const willHitTarget = ([throwX, throwY]: [number, number], [areaX, areaY]: [range,range]): boolean => {
    let stepX = 0;
    let stepY = 0;
    for (let i = 0; stepY > areaY.lowerBound; i++) {
        stepX += Math.max(0, throwX - i);
        stepY += throwY - i;
        const probe = {x: stepX, y: stepY};
        if (isInArea(probe, areaX, areaY))
            return true;
    }
    return false;
}

const allSolutions = (areaX: range, areaY: range): probe[] => {
    const possibleX = rangeArray(areaX.upperBound + 1).filter(n => (n+1)*n/2 >= areaX.lowerBound);
    const minY = areaY.lowerBound;
    const maxY = Math.max(Math.abs(areaY.lowerBound), Math.abs(areaY.upperBound));
    const possibleY = rangeArray(maxY + Math.abs(minY)).map(n => n + minY);
    
    const solutions = possibleX.map(x => {
        const validY = possibleY.filter(y => willHitTarget([x, y], [areaX, areaY]))
        return validY.map(y => ({x: x, y: y}));
    }).flat();

    return solutions;
}

const solve = (input: string): probe[] => {
    const values = input.match(/\-?\d+\.\.\-?\d+/g) as [string, string];
    const [areaX, areaY]: range[] = values.map(value => {
        const [lowerBound, upperBound] = value.split("..").map(x => +x);
        return {lowerBound: lowerBound, upperBound: upperBound};
    });
    return allSolutions(areaX, areaY)
}

const part1 = (input: string): number => Math.max(...solve(input).map(({y}) => (y+1)*y/2));
const part2 = (input: string): number => solve(input).length;

read(2021, 17).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));
