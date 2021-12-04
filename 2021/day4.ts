import { read } from "../utils"

interface Board {
    readonly values: number[];
    marked: boolean[];
    won?: boolean;
}

const toBoards = (input: string): Board[] => {
    const boards = input
        .split("\r\n\r\n").slice(1)
        .map(x => x.split("\r\n").reduce((board, row) => board + " " + row))
        .map(board => board.split(" ").filter(x => x !== "").map(x => parseInt(x)))
    
    return boards.map(board => ({
        values: board,
        marked: board.map(_ => false)
    }))
}

const boardWin = (board: Board): boolean => {
    const row = [0,1,2,3,4];
    const col = [0,5,10,15,20];

    const rowWins = col.map(dy => {
        return row.reduce((ans, x) => board.marked[x + dy] ? ans : false, true);
    })
    const colWins = row.map(dx => {
        return col.reduce((ans, y) => board.marked[y + dx] ? ans : false, true);
    })
    return [...rowWins, ...colWins].some(x => !!x);
}

const mark = (boards: Board[], n: number): Board[] => {
    return boards.map(board => {
        const index = board.values.indexOf(n);
        if (index != -1) { board.marked[index] = true; }
        return board;
    });
}

const part1 = (input: string): number => {
    const order = input.split("\r\n")[0].split(",").map(x => parseInt(x));
    let boards = toBoards(input);

    for (let n of order) {
        boards = mark(boards, n);

        for (let board of boards) {
            if (boardWin(board)) {
                const sumOfUnused = board.values.map((e, i) => e * +!board.marked[i]).reduce((acc, cur) => acc + cur, 0);
                return sumOfUnused * n;
            }
        }
    }
    return -1; // In case no board wins
}

const part2 = (input: string): number => {
    const order = input.split("\r\n")[0].split(",").map(x => parseInt(x));
    let boards: Board[] = toBoards(input).map(board => ({...board, won: false}));
    
    for (let n of order) {
        boards = mark(boards, n);

        for (let board of boards) {
            if (!board.won && boardWin(board)) {
                board.won = true;
                const wins = boards.reduce((acc, cur) => cur.won == true ? acc + 1 : acc, 0);
                if (wins == boards.length) {
                    const sumOfUnused = board.values.map((e, i) => e * +!board.marked[i]).reduce((acc, cur) => acc + cur, 0);
                    return sumOfUnused * n;
                }
            }
        }
    }
    return -1; // In case not all boards win
}

read(2021, 4).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));