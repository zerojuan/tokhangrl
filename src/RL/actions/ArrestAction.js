import { ARREST, OBJECT_LEVEL_ACTION } from "../../constants";

export default class ArrestAction {
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
        { uiType = "primary", action = ARREST, text = "Arrest" },
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
        this._host.following = this.actor;
        this._host.arrested = true;
        result.msg = `${this._host.name} is under arrest`;
        return result;
    }
}
