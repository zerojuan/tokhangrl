import { WALL, DOOR, DIRT_ROAD, ROAD } from "../constants";

export default class Tile {
    visibility = 0;
    solid = false;
    ground = true;
    value = -1;
    x = 0;
    y = 0;

    constructor({ visibility, solid, value, x, y }) {
        this.visibility = visibility;
        this.solid = solid;
        this.value = value;
        this.x = x;
        this.y = y;
    }

    get description() {
        switch (this.value) {
            case DOOR:
                return "A door";
            case WALL:
                return "A wall";
            case ROAD:
                return "A road";
            case DIRT_ROAD:
                return "A dirt road";
            default:
                return "??";
        }
    }
}
