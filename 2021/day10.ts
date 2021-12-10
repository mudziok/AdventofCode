import { read } from "../utils"

const pairs = new Map<string, string>([["(", ")"], ["[","]"], ["{", "}"], ["<", ">"]]);
const openings = [...pairs.keys()];

const scoresErrors = new Map<string, number>([[")", 3], ["]", 57], ["}", 1197], [">", 25137]]);
const scoresFixes = new Map<string, number>([[")", 1], ["]", 2], ["}", 3], [">", 4]]);

const findClosing = (line: string): string | null => {
    if (!openings.includes(line[0])) return null;
    let depth = 1;
    for (let i = 1; i < line.length; i++) {
        const char = line[i];
        depth = (openings.includes(char)) ? depth + 1 : depth - 1;
        if (depth === 0) return char;
    }
    return null;
}

const findFirstIllegal = (line: string): string | null => {
    for (let i = 0; i < line.length; i++) {
        const start = line[i];
        const end = findClosing(line.slice(i));
        if (pairs.get(start) !== end && end !== null) return end;
    }
    return null;
}

const getMissingChars = (line: string): string[] => {
    let missing: string[] = [];
    for (let i = line.length; i >= 0; i--) {
        const sliced = line.slice(i);
        const start = sliced[0];
        if (!openings.includes(start)) continue;
        
        const end = findClosing(sliced);
        if (end === null) missing = [...missing, pairs.get(start)!]
    }
    return missing;
}

const part1 = (input: string): number => {
    const lines = input.split("\r\n");
    const illegals = lines.map(line => findFirstIllegal(line)).filter(char => char !== null) as string[];
    const scores = illegals.map(char => scoresErrors.get(char)!);

    return scores.reduce((acc, cur) => acc + cur, 0)!;
}

const part2 = (input: string): number => {
    const lines = input.split("\r\n");
    const fixable = lines.filter(line => findFirstIllegal(line) === null);
    const missings = fixable.map(line => getMissingChars(line));
    const sortedScores = missings.map(chars => chars.reduce((acc, cur) => {
        return (acc * 5) + scoresFixes.get(cur)!;
    }, 0));
    
    return sortedScores[Math.floor(sortedScores.length / 2)];
}

read(2021, 10).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));