import { LEAVE, STATE_LEVEL_ACTION } from "../../constants";

export default class LeaveAction {
    get uiType() {
        return this._uiType;
    }

    get action() {
        return this._action;
    }

    get text() {
        return this._text;
    }

    constructor({ uiType = "primary", action = LEAVE, text = "Leave" }) {
        this._uiType = uiType;
        this._action = action;
        this._text = text;

        this.actionType = STATE_LEVEL_ACTION;
    }

    doAction(app) {
        app.state.world.hero.activeAction = null;
        app.setState({
            levelCleared: true,
            activeAction: null
        });
    }
}
