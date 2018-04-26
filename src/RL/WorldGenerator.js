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
    MAN,
    EXIT,
    LEAVE,
    CANCEL
} from "../constants";

import Names from "./data/Names";

import People from "./People";
import World from "./World";
import Hero from "./Hero";
import Tile from "./Tile";
import Thing from "./Thing";
import Room from "./Room";
import LeaveAction from "./actions/LeaveAction";

import {
    isRoomWithinBounds,
    doesRoomOverlap,
    isRoomTooClose
} from "./WorldUtil";

const TILE_VISIBILITY = 0.1;

function generate() {
    const level = [];

    for (let x = 0; x < COLS; x++) {
        level.push([]);
        for (let y = 0; y < ROWS; y++) {
            level[x].push(
                new Tile({
                    visibility: TILE_VISIBILITY,
                    solid: false,
                    ground: true,
                    value: DIRT_ROAD,
                    x: x,
                    y: y
                })
            );
        }
    }

    let objects = [];

    createRoad(level, 0, 25, E, 4, COLS);
    createRoad(level, COLS / 2, 0, S, 2, ROWS);

    let rooms = [];

    // generate features

    // make how many houses to create

    // make how many large houses

    // const room1 = new Room({
    //     x: 15,
    //     y: 15,
    //     width: 4,
    //     height: 4
    // });

    // const room2 = new Room({
    //     x: 16,
    //     y: 17,
    //     width: 4,
    //     height: 4
    // });

    // const room3 = new Room({
    //     x: 12,
    //     y: 14,
    //     width: 4,
    //     height: 4
    // });
    // rooms.push(room1);
    // rooms.push(room2);
    // rooms.push(room3);
    // rooms.forEach(room => {
    //     room.draw(level);
    // });

    // room1.createDoor(N, level);
    // room1.createDoor(S, level);

    // room2.createDoor(E, level);
    // room2.createDoor(S, level);

    // room3.createDoor(W, level);

    // objects = [...objects, ...room1.doors, ...room2.doors, ...room3.doors];

    rooms = [...createHouses({ largeCount: 10, smallCount: 20 }, level)];

    objects = objects.concat(...rooms.map(room => room.doors));

    const people = [];

    // create random people
    // for (let i = 0; i < 15; i++) {
    //     const randomFirstName =
    //         Names.maleNames[Math.floor(Math.random() * Names.maleNames.length)];
    //     const randomLastName =
    //         Names.lastNames[Math.floor(Math.random() * Names.lastNames.length)];
    //     const person = new People({
    //         name: `${randomFirstName} ${randomLastName}`,
    //         type: MAN,
    //         x: Math.floor(Math.random() * COLS),
    //         y: Math.floor(Math.random() * ROWS)
    //     });
    //     people.push(person);
    // }

    // create random exit objects and doors?
    // create exists
    const exits = [
        {
            x: 0,
            y: 25
        },
        {
            x: 0,
            y: 26
        },
        {
            x: 0,
            y: 27
        }
    ];
    // objects = [
    //     ...objects,
    //     ...exits.map(exit => {
    //         const exitThing = new Thing({ x: exit.x, y: exit.y, value: EXIT });
    //         exitThing.setActions([new LeaveAction({})]);
    //         exitThing.setDescription("Exit point. Leave to end mission.");
    //         return exitThing;
    //     })
    // ];

    // const testPerson = new People({
    //     name: "Juan de la Cruz",
    //     type: MAN,
    //     x: 6,
    //     y: 25
    // });

    // people.push(testPerson);
    const hero = new Hero({ x: 25, y: 21 });

    const world = new World({
        level: level,
        people: people,
        objects: objects,
        hero: hero,
        rooms: rooms
    });
    // create target
    // world.setTarget(testPerson);

    return world;
}

function createHouses({ largeCount, smallCount }, level) {
    let rooms = [];

    const top = 0;
    const left = 0;
    const maxWidth = 30;
    const maxHeight = 15;

    rooms = [
        ...createBlock(
            { largeCount, smallCount },
            { top, left, maxWidth, maxHeight }
        ),
        ...createBlock(
            { largeCount, smallCount: 10 },
            {
                top: 0,
                left: 35,
                maxWidth: 30,
                maxHeight: 15
            }
        ),
        ...createBlock(
            { largeCount, smallCount: 5 },
            {
                top: 17,
                left: 0,
                maxWidth: 15,
                maxHeight: 15
            }
        )
    ];

    console.log("How many rooms: ", rooms.length);
    rooms.forEach(room => {
        room.draw(level);
    });

    rooms.forEach(room => {
        // try to create a door
        let doors = [];
        doors = doors.concat(...rooms.map(room => room.doors));
        const doorCreated = room.createDoor(S, doors, level);
        if (!doorCreated) {
            if (!room.createDoor(E, doors, level)) {
                if (!room.createDoor(W, doors, level)) {
                    room.createDoor(N, doors, level);
                }
            }
        }
    });
    // based on how many small houses

    return rooms;
}

function createBlock(
    { smallCount, largeCount },
    { top, left, maxWidth, maxHeight }
) {
    const rooms = [];
    // divide into blocks
    for (let i = 0; i < smallCount; i++) {
        // try to generate a room randomly
        let roomFound = false;
        let maxCount = 0;
        while (!roomFound) {
            const room = new Room({
                x: left + Math.floor(Math.random() * maxWidth),
                y: top + Math.floor(Math.random() * maxHeight),
                width: 4,
                height: 4
            });

            const withinBounds = isRoomWithinBounds(
                room,
                top,
                left,
                maxWidth,
                maxHeight
            );
            let overlaps = false;
            overlaps = rooms.some(currentRoom =>
                doesRoomOverlap(room, currentRoom)
            );

            let isTooClose = true;
            isTooClose = rooms.forEach(currentRoom =>
                isRoomTooClose(room, currentRoom)
            );

            roomFound = withinBounds && !overlaps && !isTooClose;

            if (roomFound) {
                console.log("Room:", room.x, room.y);
                rooms.push(room);
            }

            maxCount++;
            if (maxCount > 10) {
                console.log("Breaking");
                break;
            }
        }
    }

    console.log("Rooms?", rooms);
    return rooms;
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
