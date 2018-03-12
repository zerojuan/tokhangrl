import { N, S, E, W, ROWS, COLS } from "../constants";
import { SHOOT, FREEZE, ARREST, TALK, CANCEL, LEAVE } from "../constants";

export default class People {
    name = "None";
    age = 25;
    occupation = {
        type: 3,
        name: "Housewife"
    };

    constructor({ name, type, x, y }) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.type = type;

        this.activeAction = null;
    }

    moveRandom() {
        // pick random direction
        const direction = Math.floor(Math.random() * 3);
        this.move(direction);
    }

    move(direction) {
        if (direction === N) {
            this.y = Math.max(0, this.y - 1);
        } else if (direction === S) {
            this.y = Math.min(ROWS - 1, this.y + 1);
        } else if (direction === E) {
            this.x = Math.min(COLS - 1, this.x + 1);
        } else if (direction === W) {
            this.x = Math.max(0, this.x - 1);
        }
    }

    registerAction(action) {
        this.activeAction = action;
    }

    do(world) {
        if (this.activeAction) {
            // better send a history report

            const message = {
                msg: `${this.name} reacted to ${this.activeAction}`
            };
            this.activeAction = null;
            return message;
        } else {
            // if (Math.random() * 50 < 25) {
            //     this.moveRandom();
            //     return { msg: `${this.name} has moved randomly` };
            // }
            return null;
        }
    }

    get position() {
        return {
            x: this.x,
            y: this.y
        };
    }

    get actionDescription() {
        return `Person ${this.name}, what to do?`;
    }

    getActions(hero) {
        const actions = [];
        if (hero.gunAimed) {
            actions.push({
                type: "primary",
                action: SHOOT,
                text: "Shoot"
            });
            actions.push({
                type: "primary",
                action: FREEZE,
                text: '"Halt!"'
            });
        } else {
            actions.push({
                type: "primary",
                action: ARREST,
                text: "Arrest"
            });
            actions.push({
                type: "primary",
                action: TALK,
                text: "Talk"
            });
        }
        actions.push({
            type: "default",
            action: CANCEL,
            text: "Cancel"
        });

        return actions;
    }
}
