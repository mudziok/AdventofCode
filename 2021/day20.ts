import { read } from "../utils"

const diffs: [number, number][] = [
    [-1,-1], [ 0,-1], [ 1,-1],
    [-1, 0], [ 0, 0], [ 1, 0],
    [-1, 1], [ 0, 1], [ 1, 1],
]

const neighbourIndex = ([x,y]: [number, number], image: boolean[][], background: boolean) => {
    const index = diffs.reduce((acc, [dx, dy]) => {
        const [nx, ny] = [x + dx, y + dy];
        const oobX = nx < 0 || nx >= 300;
        const oobY = ny < 0 || ny >= 300;
        return acc + ((oobX || oobY) ? +background : +image[nx][ny]);
    }, "")

    return index;
}

const enhance = (image: boolean[][], enhancement: string, background: boolean): boolean[][] => {
    const newImage = image.map((row, y) => {
        return row.map((_, x) => {
            const index = neighbourIndex([y,x], image, background);
            const id = parseInt(index, 2);
            return enhancement[id] === "#";
        })
    })

    return newImage;
}

const enhanceTimes = (image: boolean[][], enhancement: string, times: number, background: boolean): boolean[][] => {
    if (times === 0)
        return image;
    const enhanced = enhance(image, enhancement, !background);
    return enhanceTimes(enhanced, enhancement, times - 1, !background);
}

const litPixels = (image: boolean[][]): number => {
    return image.reduce((acc, cur) => {
        return acc + cur.reduce((acc, cur) => {
            return acc + +cur;
        }, 0)
    }, 0);
}

const solve = (input: string, times: number): number => {
    const [enhancement, imageData] = input.split("\r\n\r\n");
    const image: boolean[][] = Array(300).fill(0).map((_) => Array(300).fill(false));

    imageData.split("\r\n").forEach((line, y) => {
        line.split("").forEach((e, x) => {
            if (e === '#')
                image[x + 100][y + 100] = true;
        })
    })

    const enhanced =  enhanceTimes(image, enhancement, times, true);
    return litPixels(enhanced)
}

const part1 = (input: string): number => solve(input, 2);
const part2 = (input: string): number => solve(input, 50);

read(2021, 20).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));