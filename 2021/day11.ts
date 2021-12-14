import { read } from "../utils"

interface octopus {
    x: number,
    y: number,
    value: number
}

const step = (octopuses: octopus[]): octopus[] => {
    const increased = octopuses.map(o => ({...o, value: o.value + 1}));

    let updated: octopus[] = [];
    let flashed: octopus[] = [];
    while (true) {
        updated = increased.map(o => {
            const newValue = flashed.reduce((acc, cur) => {
                const neighbourX = o.x == cur.x - 1 || o.x == cur.x || o.x == cur.x + 1;
                const neighbourY = o.y == cur.y - 1 || o.y == cur.y || o.y == cur.y + 1;
                return (neighbourX && neighbourY) ? acc + 1 : acc;
            }, o.value);
            return {...o, value: newValue};
        });
        const postUpdateFlashed = updated.filter(o => o.value > 9);
        if (flashed.length == postUpdateFlashed.length)
            return updated.map(x => (x.value > 9) ? {...x, value: 0} : x);
        flashed = postUpdateFlashed;
    }
}

const part1 = (input: string): number => {
    let octopuses = input.split("\r\n").map((line, y) => line.split("").map((value, x) => ({x: x, y: y, value: parseInt(value)}))).flat().flat()
    
    let flashes = 0;
    for (let i = 0; i < 100; i++) {
        octopuses = step(octopuses);
        flashes += octopuses.reduce((acc, cur) => cur.value == 0 ? acc + 1 : acc, 0);
    }
    return flashes
}

const part2 = (input: string): number => {
    let octopuses = input.split("\r\n").map((line, y) => line.split("").map((value, x) => ({x: x, y: y, value: parseInt(value)}))).flat().flat()

    for (let i = 1; true; i++) {
        octopuses = step(octopuses);
        const flashes = octopuses.reduce((acc, cur) => cur.value == 0 ? acc + 1 : acc, 0);
        if (flashes == octopuses.length) return i;
    }
}

read(2021, 11).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));