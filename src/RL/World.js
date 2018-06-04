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

    get rooms() {
        return this._rooms;
    }

    get hero() {
        return this._hero;
    }

    get path() {
        return this._path;
    }

    get target() {
        return this._target;
    }

    set path(p) {
        this._path = p;
    }

    constructor({ level, people, objects, hero, path, rooms }) {
        this._level = level;
        this._people = people;
        this._objects = objects;
        this._hero = hero;
        this._path = path;
        this._rooms = rooms;

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

    hasPerson(position) {
        return this._people.some(
            person => position.col === person.x && position.row === person.y
        );
    }

    unoccupyTile(position) {
        this._level[position.col][position.row].occupied = false;
    }

    occupyTile(position) {
        this._level[position.col][position.row].occupied = true;
    }

    tick() {
        let isMoving = false;
        let history = [];

        let currentMove;

        if (!this._path) {
            isMoving = false;
        } else if (this._hero.gunAimed) {
            isMoving = false;
        } else {
            currentMove = this._path[this.currentIndex];
            if (currentMove) {
                if (this.getPerson(currentMove.col, currentMove.row)) {
                    isMoving = false; // prevent moving to another person's space
                } else {
                    isMoving = true;
                }
            } else {
                isMoving = false;
            }
        }

        if (this._hero.activeAction) {
            isMoving = false;
            // process hero action repercussions
            this._hero.activeAction = null;
        }

        this._people.forEach(person => {
            const actionResult = person.do(this);
            if (actionResult) {
                history.push(actionResult);
            }
        });

        this._objects.forEach(thing => {
            const actionResult = thing.do(this);
            if (actionResult) {
                history.push(actionResult);
            }
        });

        if (!isMoving) {
            this.currentIndex = 0;
        } else {
            this._hero.move(currentMove);

            this.currentIndex++;
            if (this._path.length === this.currentIndex) {
                isMoving = false; // stop moving if there's no more paths left
            }
        }
        return {
            isMoving,
            history
        };
    }
}
