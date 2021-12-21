import { read } from "../utils"

interface player {
    position: number,
    points: number
}

const diracDice = [1,2,3].map(x => {
    return [1,2,3].map(y => {
        return [1,2,3].map(z => [x,y,z]);
    })
}).flat(2);

const simulate = (player1: player, player2: player): [number, number] => {
    let rolls = 0;
    const players = [player1, player2];

    while (true) {
        const active = players[(rolls / 3) % 2];

        [1,2,3].forEach(x => active.position = ((active.position + rolls + x - 1) % 10) + 1);
        
        rolls += 3;
        active.points += active.position;
        if (active.points >= 1000) {
            return [rolls, players[(rolls / 3) % 2].points];
        }
    }
}

type simulateFunc = (pos1: number, pos2: number, score1: number, score2: number) => [number, number];

const memoize = (f: simulateFunc): simulateFunc => {
    const memoizeMap = new Map<string, [number, number]>();

    return (pos1: number, pos2: number, score1: number, score2: number): [number, number] => {
        const key = JSON.stringify([pos1, pos2, score1, score2]);

        if (memoizeMap.has(key))
            return memoizeMap.get(key)!;
        
        const wins = f(pos1, pos2, score1, score2);
        memoizeMap.set(key, wins);
        return wins;
    }
}

const simulateDirac = memoize(
    (pos1: number, pos2: number, score1: number, score2: number): [number, number] => {
        if (score1 >= 21) return [1,0];
        if (score2 >= 21) return [0,1];
        
        const wins = diracDice.reduce((acc, [x,y,z]) => {
            const value = x + y + z;
            const newPos = ((pos1 + value - 1) % 10) + 1;
            const newScore = newPos + score1;

            const [w2, w1] = simulateDirac(pos2, newPos, score2, newScore);
            return [acc[0] + w1, acc[1] + w2];
        }, [0,0]) as [number, number];

        return wins;
    }
)

const parse = (input: string): [player, player] => {
    const positions = input.split("\r\n").map(line => line.split(": ")[1]).map(x => +x);

    let player1: player = {position: positions[0], points: 0};
    let player2: player = {position: positions[1], points: 0};

    return [player1, player2];
} 

const part1 = (input: string): number => {
    const [player1, player2] = parse(input);
    const [rolls, loserPoints] = simulate(player1, player2);
    return rolls * loserPoints;
}

const part2 = (input: string): number => {
    const [player1, player2] = parse(input);
    return Math.max(...simulateDirac(player1.position, player2.position, 0, 0));
}

read(2021, 21).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));