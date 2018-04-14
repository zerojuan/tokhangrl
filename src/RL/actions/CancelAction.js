import { CANCEL, STATE_LEVEL_ACTION } from "../../constants";

export default class CancelAction {
    get action() {
        return this._action;
    }

    get uiType() {
        return this._uiType;
    }

    get text() {
        return this._text;
    }

    constructor({ uiType = "default", action = CANCEL, text = "Cancel" }) {
        this._uiType = uiType;
        this._action = action;
        this._text = text;

        this.actionType = STATE_LEVEL_ACTION;
    }

    doAction(app) {
        app.state.world.hero.activeAction = null;
        app.setState({
            activeSelection: null
        });
    }
}
