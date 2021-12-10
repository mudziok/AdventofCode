import { read } from "../utils"

interface point {
    x: number,
    y: number,
    value: number
}

const minNeighbours = (heighmap: point[], start: point): number => {
    const neighbourValues = getNeighbours(heighmap, start).map(neighbour => neighbour.value);
    return Math.min(...neighbourValues);
}

const getNeighbours = (heighmap: point[], start: point): point[] => {
    return heighmap.filter(point => {
        const sameX = point.x == start.x;
        const sameY = point.y == start.y;
        const nearX = point.x == start.x - 1 || point.x == start.x + 1;
        const nearY = point.y == start.y - 1 || point.y == start.y + 1;
        return (sameX && nearY) || (sameY && nearX);
    });
}

const dfs = (heighmap: point[], start: point): {notVisited: point[], basin: point[]} => {
    const neighbours = getNeighbours(heighmap, start);
    heighmap = heighmap.filter(point => point !== start);
    
    let full_basin: point[] = [];
    neighbours.forEach(neighbour => {
        if (!full_basin.includes(neighbour)) {
            const {notVisited, basin} = dfs(heighmap, neighbour);
            heighmap = notVisited;
            full_basin = [...full_basin, ...basin];
        }
    });
    return {notVisited: heighmap, basin: [...full_basin, start]};
}

const getBasins = (heightmap: point[]): point[][] => {
    let basins: point[][] = [];
    while (heightmap.length > 0) {
        const {notVisited, basin} = dfs(heightmap, heightmap[0]);
        heightmap = notVisited;
        basins = [...basins, basin];
    }
    return basins;
}

const part1 = (input: string): number => {
    const lines = input.split("\r\n");
    const heightmap = lines.map((line, y) => line.split("").map((value, x) => ({x: x, y: y, value: +value})).flat()).flat();
    const pits = heightmap.filter(p => p.value < minNeighbours(heightmap, p))

    return pits.reduce((acc, cur) => acc + cur.value + 1, 0);
}

const part2 = (input: string): number => {
    const lines = input.split("\r\n");
    const heightmap = lines.map((line, y) => line.split("").map((value, x) => ({x: x, y: y, value: +value})).flat()).flat();
    const disconnected = heightmap.filter(point => point.value !== 9);
    
    const basinSizes = getBasins(disconnected).map(basin => basin.length);
    const biggestBasins = basinSizes.sort((a, b) => b - a).slice(0, 3);
    
    return biggestBasins.reduce((acc, cur) => acc * cur, 1);
}

read(2021, 9).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));