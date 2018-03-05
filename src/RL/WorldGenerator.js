import {
    WALL,
    DOOR,
    DOOR_OPEN,
    ROAD,
    DIRT_ROAD,
    N,
    S,
    E,
    W,
    ROWS,
    COLS,
    MAN
} from "../constants";

import People from "./People";
import World from "./World";
import Hero from "./Hero";

function generate() {
    const level = [];

    for (let x = 0; x < COLS; x++) {
        level.push([]);
        for (let y = 0; y < ROWS; y++) {
            level[x].push(DIRT_ROAD);
        }
    }

    createRoad(level, 0, 25, E, 4, 160);
    createRoad(level, COLS / 2, 0, S, 2, 45);

    const people = [];

    // create random people
    for (let i = 0; i < 15; i++) {
        const person = new People({
            name: "John",
            type: MAN,
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        });
        people.push(person);
    }

    const objects = [];

    const hero = new Hero({ x: 5, y: 5 });

    return new World({
        level: level,
        people: people,
        objects: objects,
        hero: hero
    });
}

function createRoad(level, x, y, direction, width, length) {
    const startX = x;
    const startY = y;

    let iX = startX;
    let iY = startY;
    if (direction === N) {
        for (; iX < x + width; iX++) {
            for (iY = startY; iY > y - length; iY--) {
                level[iX][iY] = ROAD;
            }
        }
    } else if (direction === S) {
        for (; iX < x + width; iX++) {
            for (iY = startY; iY < y + length; iY++) {
                level[iX][iY] = ROAD;
            }
        }
    } else if (direction === E) {
        for (; iX < x + length; iX++) {
            for (iY = startY; iY < y + width; iY++) {
                level[iX][iY] = ROAD;
            }
        }
    } else if (direction === W) {
        for (; iX > x - length; iX--) {
            for (iY = startY; iY < y + width; iY++) {
                level[iX][iY] = ROAD;
            }
        }
    }
}

export default {
    generate
};
