import { read, zip } from "../utils"

type element = string;
type pair = `${element}${element}`

const addedAfterSteps = (countedPairs: Map<pair, number>, rules: Map<pair, element>, times: number): Map<element, number> => {
    if (times == 0)
        return new Map<element, number>();
    
    const newElements = new Map<element, number>();
    const postStepPairs = [...countedPairs.entries()].reduce((acc, [pair, count]) => {
        const middle = rules.get(pair)!;
        newElements.set(middle, (newElements.get(middle) ?? 0) + count);

        const pair1 = `${pair[0]}${middle}` as pair;
        const pair2 = `${middle}${pair[1]}` as pair;
        acc.set(pair1, (acc.get(pair1) ?? 0) + count);
        acc.set(pair2, (acc.get(pair2) ?? 0) + count);

        return acc;
    }, new Map<pair, number>());
    
    const addedLater = addedAfterSteps(postStepPairs, rules, times - 1);
    const addedAll = [...newElements.entries()].reduce((acc, [element, count]) => {
        acc.set(element, (acc.get(element) ?? 0) + count);
        return acc;
    }, addedLater);

    return addedAll;
}

const solve = (input: string, steps: number) => {
    const [templatePart, rulesPart] = input.split("\r\n\r\n");
    const template = templatePart.split("") as element[];
    const rules = new Map(rulesPart.split("\r\n").map(line => line.split(" -> ") as [pair, element]));
    const pairs = zip([template, template.slice(1)]).map(([a,b]) => `${a}${b}` as pair);

    const countedPairs = pairs.reduce((acc,cur) => {
        acc.set(cur, (acc.get(cur) ?? 0) + 1);
        return acc;
    }, new Map<pair, number>());

    const added = addedAfterSteps(countedPairs, rules, steps);
    const countedElements = template.reduce((acc, e) => {
        acc.set(e, (acc.get(e) ?? 0) + 1);
        return acc;
    }, added);

    const countedElementsArray = [...countedElements.entries()];
    const max = countedElementsArray[0][1];
    const min = countedElementsArray[countedElementsArray.length - 1][1];
    return max - min;
}

const part1 = (input: string): number => solve(input, 10);
const part2 = (input: string): number => solve(input, 40);

read(2021, 14).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));