import { read } from "../utils"

interface Point { x: number, y: number };
interface Line { start: Point, end: Point };
type Board = number[][];

const range = (n: number): number[] => Array.from(Array(n + 1).keys())

const minMaxRange = (start: number, stop: number): number[] => {
    return range(Math.max(start, stop) -  Math.min(start, stop));
}

const addLineAxisAligned = ({start, end}: Line, board: Board) => {
    if (start.x == end.x)
        minMaxRange(start.y, end.y).forEach(y => board[start.x][Math.min(start.y, end.y) + y]++);
    if (start.y == end.y)
        minMaxRange(start.x, end.x).forEach(x => board[start.x + x][start.y]++);
    return board;
}

const addLine = ({start, end}: Line, board: Board) => {
    board = addLineAxisAligned({start, end}, board);
    if (start.x - end.x == start.y - end.y)
        minMaxRange(start.x, end.x).forEach(x => board[start.x + x][start.y + x]++)
    if (start.x - end.x == -(start.y - end.y))
        minMaxRange(start.x, end.x).forEach(x => board[start.x + x][start.y - x]++)
    return board;
}

const toLines = (input: string): Line[] => {
    const lines = input.split("\r\n").map(line => {
        const points = line.split(" -> ");
        const [start, end] = points.map(point => {
            const [x, y] = point.split(",")
            return {x: parseInt(x), y: parseInt(y)} as Point;
        });
        if (start.x <= end.x)
            return {start: start, end: end} as Line;
        return {start: end, end: start} as Line;
    });
    return lines;
}

const solve = (input: string, lineFunction: (line: Line, board: Board) => Board): number => {
    const lines = toLines(input);
    const SIZE = 1024;
    const STARTING_BOARD = Array(SIZE).fill(0).map(_ => Array(SIZE).fill(0)) as Board;

    const final_board = lines.reduce((acc, line) => lineFunction(line, acc), STARTING_BOARD);
    const overlaps = final_board.reduce((acc, cur) =>
        acc + cur.reduce((acc, cur) => acc + +(cur > 1), 0)
    , 0)
    return overlaps;
}

const part1 = (input: string): number => solve(input, addLineAxisAligned);
const part2 = (input: string): number => solve(input, addLine);

read(2021, 5).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));