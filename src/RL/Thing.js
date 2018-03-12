import { CANCEL } from "../constants";

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

    get position() {
        return {
            x: this.x,
            y: this.y
        };
    }

    get actionDescription() {
        return this.description;
    }

    getActions(hero) {
        let actions = [];

        actions = [...this.actions];

        actions.push({
            type: "default",
            action: CANCEL,
            text: "Cancel"
        });
        return actions;
    }
}
