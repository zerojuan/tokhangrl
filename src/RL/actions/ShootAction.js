import { SHOOT, OBJECT_LEVEL_ACTION } from "../../constants";

export default class ShootAction {
    get uiType() {
        return this._uiType;
    }

    get action() {
        return this._action;
    }

    get text() {
        return this._text;
    }

    constructor({ uiType = "primary", action = SHOOT, text = "Shoot" }, host) {
        this._uiType = uiType;
        this._action = action;
        this._text = text;

        this._host = host;
        this.actionType = OBJECT_LEVEL_ACTION;
    }

    doAction() {
        const result = {};
        this._host.shotAt = true;
        // randomly decide if it was a hit based on distance
        result.msg = `BANG!`;
        return result;
    }
}
