export default class Hero {
    get position() {
        return {
            x: this.x,
            y: this.y
        };
    }

    constructor({ x, y }) {
        this.x = x;
        this.y = y;
    }
}
