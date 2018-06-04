import { BehaviorTreeStatus } from "fluent-behavior-tree";

import { findPath } from "../../RL/Pathfinder";

export default function(person) {
    return async world => {
        person.currentBehaviour = "WalkToDestination";

        person.idleTurns = 0;

        const destination = person.destination;
        const path = findPath(
            {
                col: person.x,
                row: person.y
            },
            person.destination,
            world.level
        );

        if (!path) {
            return BehaviorTreeStatus.Failure;
        }

        if (path.length === 0) {
            return BehaviorTreeStatus.Success;
        }

        // console.log(
        //     `Moving... ${person.name} to ${path[0].col},${path[0].row}`
        // );

        // is position occupied?
        // if (!world.hasPerson(path[0])) {
        person.moveToPosition(path[0]);
        // }
        // i'm done moving?
        return BehaviorTreeStatus.Running;
    };
}
