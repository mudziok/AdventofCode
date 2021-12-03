import { read } from "../utils"

type Bit = "0" | "1";
type Word = Bit[]; 

const transpose = (raport: Bit[][]) => {
    return raport[0].map((_, col) => raport.map(row => row[col]));
}

const mostFrequent = (raport: Word[], index: number) => {
    const transposed = transpose(raport);
    const numOfZeros = transposed[index].filter(x => x == '0').length;
    const halfWordLength = transposed[index].length / 2;
    return numOfZeros > halfWordLength ? '0' : '1';
}

const part1 = (input: string): number => {
    const raport = input.split("\r\n").map(bin => bin.split("")) as Word[];

    const mostFrequentBits = raport[0].map((_, i) => mostFrequent(raport, i));

    const flip = (bin: Word): Word => bin.map(x => x == '0' ? '1' : '0');

    const gamma = parseInt(mostFrequentBits.join(""), 2);
    const epsilon = parseInt(flip(mostFrequentBits).join(""), 2);
    return gamma * epsilon;
}

const part2 = (input: string): number => {
    const raport = input.split("\r\n").map(bin => bin.split("")) as Word[];

    let oxygen = raport;
    for(let i = 0; oxygen.length > 1; i++) {
        const mostFrequentBit = mostFrequent(oxygen, i);
        oxygen = oxygen.filter(num => num[i] == mostFrequentBit);
    }

    let co2 = raport;
    for(let i = 0; co2.length > 1; i++) {
        const mostFrequentBit = mostFrequent(co2, i);
        co2 = co2.filter(num => num[i] !== mostFrequentBit);
    }

    const oxygenRating = parseInt(oxygen[0].join(""), 2);
    const co2Rating = parseInt(co2[0].join(""), 2);
    return oxygenRating * co2Rating;
}

read(2021, 3).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));