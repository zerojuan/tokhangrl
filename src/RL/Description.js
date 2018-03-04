import { DOOR, ROAD, DIRT_ROAD } from "../constants";

export function describeWorld(object) {
    switch (object) {
        case DOOR:
            return "A door";
        case ROAD:
            return "A road";
        case DIRT_ROAD:
            return "A dirt road";
    }
}
