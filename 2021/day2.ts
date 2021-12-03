import { read } from "../utils"

const part1 = (input: string): number => {
    const commands = input.split("\r\n").map(line => {
        const [command, value] = line.split(" ");
        return {command: command, value: parseInt(value)}
    });
    
    const final_position = commands.reduce(({x, y}, {command, value}) => {
        switch (command) {
            case "up":
                return {x: x, y: y - value};
            case "down":
                return {x: x, y: y + value};
        }
        return {x: x + value, y: y};
    }, {x: 0, y: 0});
    
    return final_position.x * final_position.y;
}


const part2 = (input: string): number => {
    const commands = input.split("\r\n").map(line => {
        const [command, value] = line.split(" ");
        return {command: command, value: parseInt(value)}
    });
    
    const final_position = commands.reduce(({x, y, aim}, {command, value}) => {
        switch (command) {
            case "up":
                return {x: x, y: y, aim: aim - value};
            case "down":
                return {x: x, y: y, aim: aim + value};
        }
        return {x: x + value, y: y + aim * value, aim: aim};
    }, {x: 0, y: 0, aim: 0});
    
    return final_position.x * final_position.y;
}

read(2021, 2).then(input => console.log(`Part 1: ${part1(input)}, Part 2: ${part2(input)}`));