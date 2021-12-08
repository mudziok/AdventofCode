import { read } from "../utils"

const diff = (a: string[], b: string[]): string[] => a.filter(x => !b.includes(x));

const digit_codes = ["abcefg", "cf", "acdeg", "acdfg", "bcdf", "abdfg", "abdefg", "acf", "abcdefg", "abcdfg"];
const codeToDigit = (code: string): number => digit_codes.indexOf(code);

const getDecoder = (unique: string[][]): Map<string, string> => {
    const symbols = [...new Set(unique.flat())];
    const occurrences = symbols.map(letter => {
        const counts = unique.flat().filter(l => l == letter).length;
        return {letter, counts};
    });
    const decoder = symbols.reduce((acc, cur) => acc.set(cur, "?"), new Map<string, string>());
    decoder.set(occurrences.find(x => x.counts === 6)!.letter, "b");
    decoder.set(occurrences.find(x => x.counts === 4)!.letter, "e");
    decoder.set(occurrences.find(x => x.counts === 9)!.letter, "f");

    const one = unique.find(x => x.length === 2)!;
    const four = unique.find(x => x.length === 4)!;
    const seven = unique.find(x => x.length === 3)!;
    decoder.set(diff(seven, one)[0], "a");
    decoder.set(occurrences.find(x => x.counts === 8 && decoder.get(x.letter) === "?")!.letter, "c");
    
    const orBD = diff(four, one);
    decoder.set(orBD.find(x => decoder.get(x) === "?")!, "d");
    decoder.set(symbols.find(letter => decoder.get(letter) == "?")!, "g");

    return decoder;
}

const part1 = (input: string): number => {
    const lines = input.split("\r\n").map(line => line.split(" | ")[1]);
    const digits = lines.map(line => line.split(" ")).reduce((acc, cur) => [...acc, ...cur], []);
    const counts = digits.reduce((acc, cur) => {
        acc[cur.length]++;
        return acc;
    }, Array(8).fill(0))
    return counts[2] + counts[3] + counts[4] + counts[7];
};

const part2 = (input: string): number => {
    const lines = input.split("\r\n").map(line => line.split(" | "));

    const solved: number[] = lines.map(line => {
        const [unique, outputs] = line.map(x => x.split(" ").map(x => x.split("")));
        
        const decoder = getDecoder(unique);
        
        const decyphered = outputs.map(code => code.map(x => decoder.get(x)).sort().join(""));
        const combined = decyphered.map(code => codeToDigit(code).toString()).reduce((acc, cur) => acc + cur, "");
        return parseInt(combined);
    });
    return solved.reduce((acc, cur) => acc + cur);
};

read(2021, 8).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));