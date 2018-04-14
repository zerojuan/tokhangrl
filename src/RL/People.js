import { N, S, E, W, ROWS, COLS } from "../constants";
import { SHOOT, FREEZE, ARREST, TALK, CANCEL, LEAVE } from "../constants";
import { findPath } from "./Pathfinder";
import CancelAction from "./actions/CancelAction";
import ShootAction from "./actions/ShootAction";
import ArrestAction from "./actions/ArrestAction";
import TalkAction from "./actions/TalkAction";
import FreezeAction from "./actions/FreezeAction";

export default class People {
    _age = 25;
    following = null; // person this person is trying to follow
    destination = null; // position this person wants to go to

    arrested = false;
    shotAt = false;

    fear = 0;

    hp = 10;

    infoLevel = 0;

    occupation = {
        type: 3,
        name: "Housewife"
    };

    constructor({ name, type, x, y }) {
        this._name = name;
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

            const message = this.activeAction.doAction();
            this.activeAction = null;
            return message;
        } else {
            // if (Math.random() * 50 < 25) {
            //     this.moveRandom();
            //     return { msg: `${this.name} has moved randomly` };
            // }
            // return null;
        }

        if (this.following) {
            // follow this person
            this.doFollow(world);
        }
    }

    doFollow(world) {
        const target = this.following.position;
        const path = findPath(
            {
                row: this.position.y,
                col: this.position.x
            },
            {
                row: target.y,
                col: target.x
            },
            world.level
        );
        if (path.length > 0) {
            const currentMove = path[0];
            if (currentMove.col === target.x && currentMove.row === target.y) {
                return;
            }
            if (
                world.people.some(
                    person =>
                        currentMove.col === person.x &&
                        currentMove.row === person.y
                )
            ) {
                return;
            }

            this.x = currentMove.col;
            this.y = currentMove.row;
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

    get info() {
        // construct info based on info level
        const infoList = [];
        return infoList;
    }

    get name() {
        let name = this._name;
        // obfuscate
        if (this.infoLevel === 0) {
            return this._name.split(" ")[0];
        } else {
            return this._name;
        }
    }

    get age() {
        if (this.infoLevel === 0) {
            return "??";
        }
        return this._age;
    }

    getActions(hero) {
        const actions = [];
        if (hero.gunAimed) {
            actions.push(new ShootAction({}, this));
            actions.push(new FreezeAction({}, this));
        } else {
            if (!this.arrested) {
                actions.push(new ArrestAction({}, this));
            }
            actions.push(new TalkAction({}, this));
        }
        actions.push(new CancelAction({}));

        return actions;
    }
}
