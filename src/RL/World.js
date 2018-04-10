import { COLS, ROWS } from "../constants";
export default class World {
    get level() {
        return this._level;
    }

    get people() {
        return this._people;
    }

    get objects() {
        return this._objects;
    }

    get hero() {
        return this._hero;
    }

    get path() {
        return this._path;
    }

    set path(p) {
        this._path = p;
    }

    constructor({ level, people, objects, hero, path }) {
        this._level = level;
        this._people = people;
        this._objects = objects;
        this._hero = hero;
        this._path = path;

        this.currentIndex = 0;
    }

    startLongMove() {
        this.currentIndex = 0;
    }

    setTarget(target) {
        this._target = target;
    }

    getPerson(x, y) {
        return this._people.find(person => {
            return person.x === x && person.y === y;
        });
    }

    getObject(x, y) {
        return this._objects.find(object => {
            return object.x === x && object.y === y;
        });
    }

    clickedAdjacent(x, y) {
        return (
            Math.abs(this._hero.x - x) <= 1 && Math.abs(this._hero.y - y) <= 1
        );
    }

    clickedEdge(x, y) {
        return x === 0 || y === 0 || x === COLS || y === ROWS;
    }

    tick() {
        let isMoving = false;
        let history = [];

        if (!this._path) {
            isMoving = false;
        } else if (this._hero.gunAimed) {
            isMoving = false;
        } else {
            const currentMove = this._path[this.currentIndex];
            if (currentMove) {
                if (this.getPerson(currentMove.col, currentMove.row)) {
                    isMoving = false; // prevent moving to another person's space
                } else {
                    this._hero.move(currentMove);
                    this.currentIndex++;
                    isMoving = true;
                }
            } else {
                isMoving = false;
            }
        }

        console.log("Hero Action: ", this._hero.activeAction);
        if (this._hero.activeAction) {
            // process hero action repercussions
            this._hero.activeAction = null;
        }

        this._people.forEach(person => {
            const actionResult = person.do(this);
            if (actionResult) {
                history.push(actionResult);
            }
        });

        if (!isMoving) {
            this.currentIndex = 0;
        }

        return {
            isMoving,
            history
        };
    }
}
