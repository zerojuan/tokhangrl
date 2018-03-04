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

    constructor({ level, people, objects }) {
        this._level = level;
        this._people = people;
        this._objects = objects;
    }

    tick() {
        this._people.forEach(person => {
            person.moveRandom();
        });
    }
}
