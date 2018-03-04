import { N, S, E, W, ROWS, COLS } from "../constants";

export default class People {
    constructor({ name, type, x, y }) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.type = type;
    }

    moveRandom() {
        // pick random direction
        const direction = Math.floor(Math.random() * 3);
        this.move(direction);
    }

    move(direction) {
        if (direction === N) {
            this.y = Math.max(0, this.y - 1);
        } else if (direction === S) {
            this.y = Math.min(ROWS - 1, this.y + 1);
        } else if (direction === E) {
            this.x = Math.min(COLS - 1, this.x + 1);
        } else if (direction === W) {
            this.x = Math.max(0, this.x - 1);
        }
    }

    get position() {
        return {
            x: this.x,
            y: this.y
        };
    }
}
