import { read, transpose } from "../utils"

const foldX = (paper: boolean[][], fold: number): boolean[][] => {
    const newPaper = paper.map(line => {
        return line.map((value, x, l) => {
            const start = l.length - fold;
            if (x > fold - start && x < fold) {
                return l[l.length - x - 1] || value;
            }
            return value;
        })
    });
    return newPaper.map(line => line.slice(0, fold));
}

const foldY = (paper: boolean[][], fold: number): boolean[][] => transpose(foldX(transpose(paper), fold));

const foldInstruction = (paper: boolean[][], instruction: string) => {
    const fold = parseInt(instruction.split("=")[1]);
    if (instruction[11] === "y")
        return foldY(paper, fold);
    return foldX(paper, fold);
}

const getPaper = (input: string): [boolean[][], string[]] => {
    const [dotsPart, instructionsPart] = input.split("\r\n\r\n");
    const dots = dotsPart.split("\r\n").map(line => line.split(",").map(value => parseInt(value)));
    const [maxX, maxY] = dots.reduce(([x1,y1], [x2,y2]) => ([Math.max(x1, x2+1), Math.max(y1, y2+1)]), [0,0]);
    const blank = Array(maxY).fill(0).map(_ => Array(maxX).fill(0));

    const paper = dots.reduce((acc, [x,y]) => {
        acc[y][x] = 1; return acc;
    }, blank) as boolean[][];
    
    return [paper, instructionsPart.split("\r\n")];
}

const part1 = (input: string): number => {
    const [paper, instructions] = getPaper(input);
    const folded = foldInstruction(paper, instructions[0]);
    return folded.flat().reduce((acc, cur) => acc + +cur, 0);
}

const part2 = (input: string): number => {
    const [paper, instructions] = getPaper(input);
    const folded = instructions.reduce((acc, cur) => foldInstruction(acc, cur), paper);
    console.table(folded);
    return NaN;
}

read(2021, 13).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));