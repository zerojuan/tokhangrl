import { N, S, E, W, ROWS, COLS, MAN } from "../constants";
import { SHOOT, FREEZE, ARREST, TALK, CANCEL, LEAVE } from "../constants";
import { findPath } from "./Pathfinder";
import CancelAction from "./actions/CancelAction";
import ShootAction from "./actions/ShootAction";
import ArrestAction from "./actions/ArrestAction";
import TalkAction from "./actions/TalkAction";
import FreezeAction from "./actions/FreezeAction";

import PersonBehaviour from "../ai/PersonBehaviour";

export default class People {
    _age = 25;
    following = null; // person this person is trying to follow
    destination = null; // position this person wants to go to

    arrested = false;
    shotAt = false;

    fear = 0;

    hp = 10;

    infoLevel = 0;

    maxIdle = 20;
    idleTurns = 0;

    house = null;

    occupation = {
        type: 3,
        name: "Housewife"
    };

    relations = [];

    gender = MAN;

    behaviour = null;

    destination = null;

    world = null;

    constructor({ name, type, x, y, age }) {
        this._name = name;
        this.x = x;
        this.y = y;
        this.type = type;
        this.gender = type;
        this._age = age;

        this.activeAction = null;

        this.behaviour = PersonBehaviour(this);
    }

    moveRandom() {
        // pick random direction
        const direction = Math.floor(Math.random() * 3);
        this.move(direction);
    }

    moveToPosition({ row, col }) {
        if (!this.world) {
            console.error("Attempted to move person, but world is not defined");
            return;
        }

        // set previous position to un-occupied
        this.world.unoccupyTile({ row: this.y, col: this.x });

        this.x = col;
        this.y = row;
        // set new position to occupied
        this.world.occupyTile({ row, col });
    }

    move(direction) {
        if (direction === N) {
            this.moveToPosition({
                row: Math.max(0, this.y - 1),
                col: this.x
            });
        } else if (direction === S) {
            this.moveToPosition({
                row: Math.min(ROWS - 1, this.y + 1),
                col: this.x
            });
        } else if (direction === E) {
            this.moveToPosition({
                row: this.y,
                col: Math.min(COLS - 1, this.x + 1)
            });
        } else if (direction === W) {
            this.moveToPosition({
                row: this.y,
                col: Math.max(0, this.x - 1)
            });
        }
    }

    registerAction(action) {
        this.activeAction = action;
    }

    do(world) {
        this.world = world;
        if (this.activeAction) {
            // better send a history report

            const message = this.activeAction.doAction();
            this.activeAction = null;
            return message;
        }

        if (this.following) {
            // follow this perDson
            return this.doFollow(world);
        }

        // else do default behaviour
        this.behaviour.tick(world);
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
        if (path && path.length > 0) {
            const currentMove = path[0];
            if (currentMove.col === target.x && currentMove.row === target.y) {
                return;
            }

            // if position is already occupied don't go there
            if (
                world.people.some(
                    person =>
                        currentMove.col === person.x &&
                        currentMove.row === person.y
                )
            ) {
                return;
            }

            this.moveToPosition(currentMove);
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
        const infoList = [this.currentBehaviour];
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
