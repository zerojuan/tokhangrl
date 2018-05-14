import {
    DOOR_ACTION,
    DOOR,
    DOOR_OPEN,
    OBJECT_LEVEL_ACTION
} from "../../constants";

export default class DoorAction {
    get uiType() {
        return this._uiType;
    }

    get action() {
        return this._action;
    }

    get text() {
        console.log("Value:", this._host.value);
        if (this._host.value === DOOR) {
            return "Open";
        }
        return "Close";
    }

    constructor(
        { uiType = "primary", action = DOOR_ACTION, text = "Door" },
        host
    ) {
        this._uiType = uiType;
        this._action = action;
        this._text = text;

        this._host = host;
        this.actionType = OBJECT_LEVEL_ACTION;
    }

    doAction(world) {
        const result = {};
        const tile = world.level[this._host.position.x][this._host.position.y];
        if (this._host.value === DOOR) {
            result.msg = "Door is now open";
            this._host.value = DOOR_OPEN;

            tile.solid = false;
        } else {
            result.msg = "Door is now closed";
            this._host.value = DOOR;

            tile.solid = true;
        }
        return result;
    }
}
