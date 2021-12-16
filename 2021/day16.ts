import { read } from "../utils"

interface packet {
    version: number,
    value?: number,
    ID: number,
    subpackets: packet[]
}

const decodeLiteral = (data: string): [number, string] => {
    const rest = data.slice(6);
    const CHUNK_SIZE = 5;
    const chunks = Array(Math.ceil(rest.length / CHUNK_SIZE)).fill(0).map((_, i) => rest.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE));
    
    const [included, excluded] = chunks.reduce(([i, e], cur) => {
        if (i.length === 0)
            return [[...i, cur], e];
        if (cur[0] == "1" && i[i.length - 1][0] !== "0")
            return [[...i, cur], e];
        if (i[i.length - 1][0] === "1")
            return [[...i, cur], e];
        return [i, [...e, cur]];
    }, [[], []] as [string[], string[]]);

    const numbers = included.map(chunk => {
        return parseInt(chunk.slice(1, 5), 2).toString(16);
    });
    const value = parseInt(numbers.join(""), 16);

    return [value, excluded.join("")]
}

const getSubpacketsByLength = (data: string): [packet[], string] => {
    const length = parseInt(data.slice(7, 22), 2);
    let rest = data.slice(22, 22 + length);
    let subpackets: packet[] = [];
    while (rest.length > 0) {
        const [newPacket, newRest] = decode(rest)!;
        subpackets = [...subpackets, newPacket];
        rest = newRest;
    }
    return [subpackets, data.slice(22 + length)];
}

const getSubpacketsByAmount = (data: string): [packet[], string] => {
    const numSubpackets = parseInt(data.slice(7,18), 2);
    let rest = data.slice(18);
    let subpackets: packet[] = [];
    for (let n = 0; n < numSubpackets; n++) {
        const [newPacket, newRest] = decode(rest)!;
        subpackets = [...subpackets, newPacket];
        rest = newRest;
    }
    return [subpackets, rest];
}

const decode = (data: string): [packet, string] => {
    const version = parseInt(data.slice(0,3), 2);
    const ID = parseInt(data.slice(3,6), 2);
    const isLiteral = (ID === 4);
    if (isLiteral) {
        const [value, rest] = decodeLiteral(data);
        return [{version: version, ID: ID, value: value, subpackets: []}, rest];
    } else {
        const decodeByLength = !parseInt(data.slice(6,7), 2);
        const [subpackets, rest] = decodeByLength ? getSubpacketsByLength(data) : getSubpacketsByAmount(data);
        return [{version: version, ID: ID, subpackets: subpackets}, rest];
    }
}

const getTree = (input: string) => {
    const binary = input.split("").map(digit => parseInt(digit, 16).toString(2).padStart(4,'0')).join('');
    const [root, _] = decode(binary);
    return root;
}

const sumPacketVersion = (tree: packet): number => {
    const sumSubpackets = (tree.subpackets?.reduce((acc, sub) => acc + sumPacketVersion(sub), 0) ?? 0);
    return tree.version + sumSubpackets;
}

const packetValue = (root: packet): number => {
    const subValues = root.subpackets.map(sub => packetValue(sub));
    switch(root.ID) {
        case 0: return subValues.reduce((acc, cur) => acc + cur, 0);
        case 1: return subValues.reduce((acc, cur) => acc * cur, 1);
        case 2: return Math.min(...subValues);
        case 3: return Math.max(...subValues);
        case 4: return root.value!;
        case 5: { const [first, second] = subValues; return +(first > second); }
        case 6: { const [first, second] = subValues; return +(first < second); }
        case 7: { const [first, second] = subValues; return +(first === second); }
    }
    throw Error("ID interpretation failed");
}

const part1 = (input: string) => sumPacketVersion(getTree(input));
const part2 = (input: string) => packetValue(getTree(input));

read(2021, 16).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));
