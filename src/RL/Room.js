import {
    DOOR,
    WALL,
    DOOR_ACTION,
    ROAD,
    N,
    S,
    E,
    W,
    DIRT_ROAD
} from "../constants";

import { oppositesFree, distance } from "./WorldUtil";

import Thing from "./Thing";
import DoorAction from "./actions/DoorAction";

export default class Room {
    _doors = [];
    _width = 0;
    _height = 0;
    _x = 0;
    _y = 0;

    get doors() {
        return this._doors;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get area() {
        return this._width * this._height;
    }

    constructor({ width, height, x, y }) {
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
    }

    pickDoorInDirection(direction) {
        let xToMatch = this._x;
        let yToMatch = this._y;

        if (direction === S) {
            yToMatch = this._y + this._height;
        } else if (direction === E) {
            xToMatch = this._x + this._width;
        }

        let door;
        if (direction === S || direction === N) {
            // look up doors
            door = this.doors.filter(door => door.y === yToMatch)[0];
        } else {
            door = this.doors.filter(door => door.x === xToMatch)[0];
        }

        return door;
    }

    createDoor(direction, doors, level) {
        const x = this._x;
        const y = this._y;
        const width = this._width;
        const height = this._height;

        if (this.pickDoorInDirection(direction)) {
            // because you can't have a door in the same direction
            return;
        }

        const possiblePositions = [];

        if (direction === N) {
            // loop through each top wall
            for (let iX = x; iX < x + width; iX++) {
                possiblePositions.push({ x: iX, y });
            }
        } else if (direction === S) {
            // loop through each
            for (let iX = x; iX < x + width; iX++) {
                possiblePositions.push({ x: iX, y: y + height - 1 });
            }
        } else if (direction === E) {
            for (let iY = y; iY < y + height; iY++) {
                possiblePositions.push({ x: x + width - 1, y: iY });
            }
        } else if (direction === W) {
            for (let iY = y; iY < y + height; iY++) {
                possiblePositions.push({ x, y: iY });
            }
        }

        const finalPositions = possiblePositions.filter(
            position =>
                oppositesFree(position, level) &&
                !doors.some(d => distance(d, position) <= 1)
        );

        // console.log("Possible psoitions", possiblePositions);
        // console.log("Considering adding to these locations:", finalPositions);
        if (finalPositions.length === 0) {
            return;
        }

        const doorPosition =
            finalPositions[Math.floor(Math.random() * finalPositions.length)];

        // create a door
        const door = new Thing({
            x: doorPosition.x,
            y: doorPosition.y,
            value: DOOR
        });
        door.setActions([new DoorAction({}, door)]);
        door.setDescription(`Door to this house. ${this.x}, ${this.y}`);

        // set level to blank
        level[doorPosition.x][doorPosition.y].value = ROAD;

        this._doors.push(door);

        return door;
    }

    toString() {
        return `${this.x}, ${this.y}, ${this.width}, ${this.height}`;
    }

    getOpenSpots(level) {
        const { _x: x, _y: y, _height: height, _width: width } = this;

        for (let iX = x; iX < x + width; iX++) {
            for (let iY = y; iY < y + height; iy++) {
                // is this a door?
                const door = this._doors.find(d => {
                    return d.position.x === iX && d.position.y === iY;
                });

                if (door) {
                    continue;
                }
            }
        }
    }

    draw(level) {
        const x = this._x;
        const y = this._y;
        const height = this._height;
        const width = this._width;

        // create walls
        for (let iX = x; iX < x + width; iX++) {
            for (let iY = y; iY < y + height; iY++) {
                if (
                    iX === x ||
                    iX === x + width - 1 ||
                    iY === y ||
                    iY === y + height - 1
                ) {
                    // does this match a door?
                    const door = this._doors.find(d => {
                        return d.position.x === iX && d.position.y === iY;
                    });

                    if (!door) {
                        level[iX][iY].value = WALL;
                    }

                    level[iX][iY].solid = true;
                    level[iX][iY].ground = false;
                } else {
                    level[iX][iY].value = ROAD;
                    level[iX][iY].solid = false;
                    level[iX][iY].ground = true;
                }
            }
        }
    }
}
