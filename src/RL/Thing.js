import { CANCEL } from "../constants";
import CancelAction from "./actions/CancelAction";

export default class Thing {
    constructor({ x, y, value }) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    setActions(actions) {
        this.actions = actions;
    }

    setDescription(description) {
        this.description = description;
    }

    registerAction(action) {
        this.activeAction = action;
    }

    get position() {
        return {
            x: this.x,
            y: this.y
        };
    }

    get actionDescription() {
        return this.description;
    }

    do(world) {
        if (this.activeAction) {
            const result = this.activeAction.doAction(world);
            this.activeAction = null;
            return result;
        }
    }

    getActions(hero) {
        let actions = [];

        actions = [...this.actions];

        actions.push(new CancelAction({}));
        return actions;
    }
}
