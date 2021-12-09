import { read } from "../utils"

const diff = (a: string, b: string): string[] => a.split("").filter(x => !b.split("").includes(x));

const getDecoder = (unique: string[]) => {
    const decoder = unique.reduce((acc, cur) => acc.set(cur, -1), new Map<string, number>());
    
    const one = unique.find(x => x.length === 2)!;
    const four = unique.find(x => x.length === 4)!;
    const seven = unique.find(x => x.length === 3)!;
    const eight = unique.find(x => x.length === 7)!;
    
    decoder.set(one, 1);
    decoder.set(four, 4);
    decoder.set(seven, 7);
    decoder.set(eight, 8);

    unique.filter(x => x.split("").length === 5).forEach(code => {
        if (diff(code, one).length === 3) decoder.set(code, 3);
        else if (diff(code, four).length === 3) decoder.set(code, 2);
        else decoder.set(code, 5);
    });

    unique.filter(x => x.split("").length === 6).forEach(code => {
        if (diff(code, one).length === 5) decoder.set(code, 6);
        else if (diff(code, four).length === 2) decoder.set(code, 9);
        else decoder.set(code, 0);
    })
    
    return decoder;
}

const part1 = (input: string): number => {
    const lines = input.split("\r\n").map(line => line.split(" | "));

    const solved = lines.map(line => {
        const [unique, outputs] = line.map(x => x.split(" ").map(code => code.split("").sort().join("")));
        const decoder = getDecoder(unique);
        return outputs.map(code => decoder.get(code)!);
    });
    return solved.flat().filter(x => [1,4,7,8].includes(x)).length;
};

const part2 = (input: string): number => {
    const lines = input.split("\r\n").map(line => line.split(" | "));

    const solved = lines.map(line => {
        const [unique, outputs] = line.map(x => x.split(" ").map(code => code.split("").sort().join("")));
        const decoder = getDecoder(unique);
        const decyphered = outputs.map(code => decoder.get(code)!);
        return +decyphered.join("");
    });
    return solved.reduce((acc, cur) => acc + cur);
};

read(2021, 8).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));