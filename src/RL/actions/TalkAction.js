import { TALK, OBJECT_LEVEL_ACTION } from "../../constants";

export default class TalkAction {
    get uiType() {
        return this._uiType;
    }

    get action() {
        return this._action;
    }

    get text() {
        return this._text;
    }

    constructor({ uiType = "primary", action = TALK, text = "Talk" }, host) {
        this._uiType = uiType;
        this._action = action;
        this._text = text;

        this._host = host;
        this.actionType = OBJECT_LEVEL_ACTION;
    }

    doAction() {
        const result = {};
        result.msg = `${this._host.name} talked to you`;
        this._host.fear += 1;
        this._host.infoLevel += 1;

        return result;
    }
}
