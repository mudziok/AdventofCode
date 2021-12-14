import { read } from "../utils"

type Path = string[]

const dfs = (caveSystem: Map<string, string[]>, start: string, revisitAvaliable: boolean, visited = new Set()): Path[] => {
    const nexts = caveSystem.get(start)!;
    const endings: Path[] = nexts.reduce((acc, cur) => {
        if (visited.has(cur) || cur === "start")
            return [...acc];
        if (cur === "end")
            return [...acc, ["end"]];
        const newVisited = new Set(JSON.parse(JSON.stringify([...visited])));
        if (cur === cur.toLowerCase())
            newVisited.add(cur);
        if (revisitAvaliable && cur === cur.toLowerCase()) {
            const newVisitedUnchanged = new Set(JSON.parse(JSON.stringify([...visited])));
            return [...acc, ...dfs(caveSystem, cur, revisitAvaliable, newVisited), ...dfs(caveSystem, cur, false, newVisitedUnchanged)];
        }
        return [...acc, ...dfs(caveSystem, cur, revisitAvaliable, newVisited)]
    }, [] as Path[])
    return endings.map(ending => [start, ...ending]);
}

const removeDuplicatePaths = (paths: Path[]): Path[] => {
    const pathsJSON = paths.map(path => JSON.stringify(path));
    return [...new Set(pathsJSON)].map(x => JSON.parse(x));
}

const solve = (input: string, revisitAvaliable: boolean) => {
    const connections = input.split("\r\n").map(line => line.split("-") as [string, string]);
    const caves = connections.flat().filter((cave, i, caves) => i === caves.indexOf(cave));
    const caveSystem = new Map(caves.map(cave => {
        const connectsTo = connections.reduce((acc, [a, b]) => {
            if (a == cave) return [...acc, b];
            if (b == cave) return [...acc, a];
            return acc;
        }, [] as string[]);
        return [cave, connectsTo];
    }))

    const paths = dfs(caveSystem, "start", revisitAvaliable);
    const unique = removeDuplicatePaths(paths);
    return unique.length;
}

const part1 = (input: string): number => solve(input, false);
const part2 = (input: string): number => solve(input, true);

read(2021, 12).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));