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
import Tile from "./Tile";

function generate() {
    const level = [];

    for (let x = 0; x < COLS; x++) {
        level.push([]);
        for (let y = 0; y < ROWS; y++) {
            level[x].push(
                new Tile({
                    visibility: 0.2,
                    solid: false,
                    ground: true,
                    value: DIRT_ROAD
                })
            );
        }
    }

    createRoad(level, 0, 25, E, 4, 160);
    createRoad(level, COLS / 2, 0, S, 2, 45);

    createRoom(level, 15, 15, 20, 5);

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

    const hero = new Hero({ x: 25, y: 25 });

    return new World({
        level: level,
        people: people,
        objects: objects,
        hero: hero
    });
}

function createRoom(level, x, y, width, height) {
    // create walls
    for (let iX = x; iX < x + width; iX++) {
        for (let iY = y; iY < y + height; iY++) {
            level[iX][iY].value = WALL;
            level[iX][iY].solid = true;
            level[iX][iY].ground = false;
        }
    }
}

function createRoad(level, x, y, direction, width, length) {
    const startX = x;
    const startY = y;

    let iX = startX;
    let iY = startY;
    if (direction === N) {
        for (; iX < x + width; iX++) {
            for (iY = startY; iY > y - length; iY--) {
                level[iX][iY].value = ROAD;
            }
        }
    } else if (direction === S) {
        for (; iX < x + width; iX++) {
            for (iY = startY; iY < y + length; iY++) {
                level[iX][iY].value = ROAD;
            }
        }
    } else if (direction === E) {
        for (; iX < x + length; iX++) {
            for (iY = startY; iY < y + width; iY++) {
                level[iX][iY].value = ROAD;
            }
        }
    } else if (direction === W) {
        for (; iX > x - length; iX--) {
            for (iY = startY; iY < y + width; iY++) {
                level[iX][iY].value = ROAD;
            }
        }
    }
}

export default {
    generate
};
