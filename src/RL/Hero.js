export default class Hero {
    gunAimed = false;
    items = [];
    kills = 0;
    missions = 0;
    ammo = 9;
    name = "??? ???";

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

    move(currentMove) {
        this.x = currentMove.col;
        this.y = currentMove.row;
    }
}
