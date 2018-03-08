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

    getPerson(x, y) {
        return this._people.find(person => {
            return person.x === x && person.y === y;
        });
    }

    clickedAdjacent(x, y) {
        return (
            Math.abs(this._hero.x - x) <= 1 && Math.abs(this._hero.y - y) <= 1
        );
    }

    tick() {
        let isMoving = false;
        let history = [];

        if (!this._path) {
            isMoving = false;
        } else {
            const currentMove = this._path[this.currentIndex];
            if (currentMove) {
                if (this.getPerson(currentMove.col, currentMove.row)) {
                    isMoving = false;
                } else {
                    this._hero.move(currentMove);
                    this.currentIndex++;
                    isMoving = true;
                }
            }
        }

        this._people.forEach(person => {
            const actionResult = person.do(this);
            if (actionResult) {
                history.push(actionResult);
            }
        });

        console.log("Did I move", history);
        return {
            isMoving,
            history
        };
    }
}
