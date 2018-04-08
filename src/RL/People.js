import { N, S, E, W, ROWS, COLS } from "../constants";
import { SHOOT, FREEZE, ARREST, TALK, CANCEL, LEAVE } from "../constants";
import { findPath } from "./Pathfinder";
export default class People {
    age = 25;
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

            const message = this.doAction(this.activeAction);
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

    doAction(action) {
        const result = {};
        switch (action.action) {
            case SHOOT:
                this.shotAt = true;
                // randomly decide if it was a hit based on distance
                break;
            case FREEZE:
                this.fear += 60;
                break;
            case ARREST:
                this.following = action.actor;
                this.arrested = true;
                result.msg = `${this.name} is under arrest`;
                break;
            case TALK:
                result.msg = `${this.name} talked to you`;
                this.fear += 1;
                this.infoLevel += 1;
                // pick a person from your relatives to rat out
                break;
        }

        return result;
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
            if (!this.arrested) {
                actions.push({
                    type: "primary",
                    action: ARREST,
                    text: "Arrest"
                });
            }
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
