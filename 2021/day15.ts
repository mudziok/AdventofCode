import { read } from "../utils"

type coords = [number, number]

const getNeighbours = (riskMap: number[][], [x,y]: coords) => {
    const neighbours = [[x-1,y], [x+1,y], [x,y-1], [x,y+1]];
    return neighbours.filter(([x,y]) => {
        const invalidX = x < 0 || x >= riskMap[0].length;
        const invalidY = y < 0 || y >= riskMap.length;
        return !invalidX && !invalidY;
    });
}

const dijkstra = (riskMap: number[][], [startX, startY]: coords) => {
    const queue: coords[] = [[startX, startY]];
    let cost = riskMap.map(row => row.map(_ => Infinity));
    cost[startY][startX] = 0;
    
    while (queue.length > 0) {
        const [x,y] = queue.shift()!;
        const neighbours = getNeighbours(riskMap, [x,y]);

        neighbours.forEach(([nx,ny]) => {
            if (cost[ny][nx] > cost[y][x] + riskMap[ny][nx]) {
                cost[ny][nx] = cost[y][x] + riskMap[ny][nx];
                queue.push([nx,ny])
            }
        })
    }

    return cost[riskMap.length - 1][riskMap[0].length - 1];
}

const addInLine = (line: number[], amount: number) => line.map(x => ((x + amount - 1) % 9) + 1);
const addInSegment = (lines: number[][], amount: number) => lines.map(line => line.map(x => ((x + amount - 1) % 9) + 1));

const part1 = (input: string): number => {
    const riskMap = input.split("\r\n").map(line => line.split("").map(value => parseInt(value)));
    return dijkstra(riskMap, [0,0]);
}

const part2 = (input: string): number => {
    const riskMapInitial = input.split("\r\n").map(line => line.split("").map(value => parseInt(value)));
    const riskMapRows = riskMapInitial.map(line => [...line, ...addInLine(line, 1), ...addInLine(line, 2), ...addInLine(line, 3), ...addInLine(line, 4)]);
    const riskMap = [...riskMapRows, ...addInSegment(riskMapRows, 1), ...addInSegment(riskMapRows, 2), ...addInSegment(riskMapRows, 3), ...addInSegment(riskMapRows, 4)];
    return dijkstra(riskMap, [0,0]);
}

read(2021, 15).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));