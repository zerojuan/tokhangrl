import { DOOR, WALL, DOOR_ACTION } from "../constants";

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

    constructor({ width, height, x, y }) {
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;

        // create a door
        const door = new Thing({
            x: x + Math.floor(width / 2),
            y: y + height - 1,
            value: DOOR
        });
        door.setActions([new DoorAction({}, door)]);
        door.setDescription("Door to this house.");

        this._doors.push(door);
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

                    if (door) {
                        continue;
                    }

                    level[iX][iY].value = WALL;
                    level[iX][iY].solid = true;
                    level[iX][iY].ground = false;
                }
            }
        }
    }
}
