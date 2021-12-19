import { read } from "../utils"

type Node = [Element, Element]
type Element = Node | number

const indexTree = (root: Element, indexMap: number[]): Element => {
    if (typeof root === "number") {
        indexMap.push(root)
        return indexMap.length - 1;
    }
    const [left, right] = root;
    return [indexTree(left, indexMap), indexTree(right, indexMap)];
}

const explode = (root: Element, indexMap: number[], depth: number = 1, shift: number = 0): [Element, number] => {
    if (typeof root === "number")
        return [root + shift, shift];
    
    const [left, right] = root;
    if (typeof left === "number" && typeof right === "number" && depth > 4) {
        if (shift !== 0)
            return [[left + shift, right + shift], shift];

        if (left > 0) 
            indexMap[left - 1] += indexMap[left];
        if (right < indexMap.length - 1)
            indexMap[right + 1] += indexMap[right];
        
        indexMap.splice(left, 2, 0);
        return [left, -1];
    }

    const [newLeft, shiftLeft] = explode(left, indexMap, depth + 1, shift);
    const [newRight, shiftRight] = explode(right, indexMap, depth + 1, shiftLeft);
    return [[newLeft, newRight], shiftRight];
}

const split = (root: Element, indexMap: number[], shift: number = 0): [Element, number] => {
    if (typeof root === "number") {
        if (shift !== 0)
            return [root + shift, shift];
        
        const value = indexMap[root]
        if (value >= 10) {
            indexMap.splice(root, 1, Math.floor(value/2.0));
            indexMap.splice(root + 1, 0, Math.ceil(value/2.0));
            return [[root, root + 1], 1];
        }
        return [root + shift, shift];
    }

    const [left, right] = root;
    const [newLeft, shiftLeft] = split(left, indexMap, shift);
    const [newRight, shiftRight] = split(right, indexMap, shiftLeft);
    return [[newLeft, newRight], shiftRight];
}

const process = (root: Element, indexMap: number[]): Element => {
    for (;;) {
        const [exploded, shiftExploded] = explode(root, indexMap);
        if (shiftExploded) { root = exploded; continue; }

        const [splitted, shiftSplitted] = split(root, indexMap);
        if (shiftSplitted) { root = splitted; continue; }

        break;
    }
    return root;
}

const magnitude = (root: Element, indexMap: number[]): number => {
    if (typeof root === "number")
        return indexMap[root];
    
    const [left, right] = root;
    return 3 * magnitude(left, indexMap) + 2 * magnitude(right, indexMap);
}

const part1 = (input: string): number => {
    const roots = input.split("\r\n").map(x => JSON.parse(x));
    const indexMap: number[] = [];
    const indexed = indexTree(roots[0], indexMap);
    const res = roots.slice(1).reduce((acc, cur) => {
        const curIndexed = indexTree(cur, indexMap);
        return process([acc, curIndexed], indexMap);
    }, indexed);

    return magnitude(res, indexMap);
}

const part2 = (input: string): number => {
    const roots = input.split("\r\n").map(x => JSON.parse(x));
    const maginitudes: number[] = [];

    for (let i = 0; i < roots.length; i++) {
        for (let j = 0; j < roots.length; j++) {
            if (i === j) continue;

            const indexMap: number[] = [];
            const pair = [roots[i], roots[j]] as Element;
            const indexed = indexTree(pair, indexMap);
            const processed = process(indexed, indexMap);

            maginitudes.push(magnitude(processed, indexMap));
        }
    }

    return Math.max(...maginitudes);
}

read(2021, 18).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));
