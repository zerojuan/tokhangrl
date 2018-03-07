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

    tick() {
        if (!this._path) {
            return false;
        }
        const currentMove = this._path[this.currentIndex];
        if (currentMove) {
            // this._people.forEach(person => {
            //     person.moveRandom();
            // });

            this._hero.move(currentMove);
            this.currentIndex++;
            return true;
        }
        return false;
    }
}
