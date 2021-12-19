import { read } from "../utils"

type Coords = [number, number, number]

const flips: ((c: Coords) => Coords)[] = [
    ([x, y, z]) => [x, y, z],
    ([x, y, z]) => [-z, y, x],
    ([x, y, z]) => [-x, y, -z],
    ([x, y, z]) => [z, y, -x],
    ([x, y, z]) => [-y, x, z],
    ([x, y, z]) => [y, -x, z],
]

const rotations: ((c: Coords) => Coords)[] = [
    ([x,y,z]) => [x,y,z],
    ([x,y,z]) => [x,-z,y],
    ([x,y,z]) => [x,-y,-z],
    ([x,y,z]) => [x,z,-y]
]

const transforms = flips.map(flip => 
    rotations.map(rotation => 
        (c: Coords) => flip(rotation(c))
        )
    ).flat();

const tryEveryBeacon = (transformed: Coords[], beacons: Set<string>) => {
    const origin = [...beacons.values()].map(x => JSON.parse(x));
    for (const to of transformed) {
        for (const o of origin) {
            const diff = [o[0] - to[0], o[1] - to[1], o[2] - to[2]] as Coords;
            
            let count = 0;
            for (const t of transformed) {
                const translated = [t[0] + diff[0], t[1] + diff[1], t[2] + diff[2]] as Coords;

                if (beacons.has(JSON.stringify(translated)))
                    count++;
                if (count == 12)
                    return diff;
            }
        }
    }
    return null;
}

const tryEveryTransform = (beacons: Set<string>, combining: Coords[]) => {
    for (const transform of transforms) {
        const transformed = combining.map(x => transform(x));
        const move = tryEveryBeacon(transformed, beacons);
        if (move == null)
            continue;

        for (const t of transformed) {
            const alligned = [t[0] + move[0], t[1] + move[1], t[2] + move[2]];
            beacons.add(JSON.stringify(alligned));
        }
        return move;
    }
    return null;
}

const combine = (origin: Coords[], toCombine: Coords[][]): [Set<string>, Coords[]] => {
    const beacons = new Set(origin.map(x => JSON.stringify(x)));
    const scanners: Coords[] = []
    let i = 0;
    while (toCombine.length > 0) {
        i  = (i + 1) % toCombine.length;
        const scanner = tryEveryTransform(beacons, toCombine[i]);
        if (scanner) {
            scanners.push(scanner);
            toCombine.splice(i, 1);
        }
    }
    return [beacons, scanners];
}

const solve = (input: string): [Set<string>, Coords[]] => {
    const scanners = input.split("\r\n\r\n")
        .map(scanner => 
            scanner.split("\r\n").slice(1).map(coords => 
                coords.split(",").map(x => +x) as Coords
            ));
    const origin = scanners[0];
    const toCombine = scanners.slice(1);

    return combine(origin, toCombine);
}

const part1 = (beacons: Set<string>): number => beacons.size;

const part2 = (scanners: Coords[]): number => {
    const distances = scanners.map(a => {
        return scanners.map(b => {
            return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
        });
    }).flat();

    return Math.max(...distances);
}

read(2021, 19).then(input => {const [beacons, scanners] = solve(input); console.log(`Part 1: ${part1(beacons)}, Part 2: ${part2(scanners)}`)});
