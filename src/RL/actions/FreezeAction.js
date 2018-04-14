import { FREEZE, OBJECT_LEVEL_ACTION } from "../../constants";

export default class FreezeAction {
    get uiType() {
        return this._uiType;
    }

    get action() {
        return this._action;
    }

    get text() {
        return this._text;
    }

    constructor(
        { uiType = "primary", action = FREEZE, text = "Freeze" },
        host
    ) {
        this._uiType = uiType;
        this._action = action;
        this._text = text;

        this._host = host;
        this.actionType = OBJECT_LEVEL_ACTION;
    }

    doAction() {
        const result = {};
        this._host.fear += 60;
        result.msg = "Hwag po!";
        return result;
    }
}
