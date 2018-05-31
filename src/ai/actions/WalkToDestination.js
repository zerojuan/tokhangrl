import { BehaviorTreeStatus } from "fluent-behavior-tree";

import { findPath } from "../../RL/Pathfinder";

export default function(person) {
    return async world => {
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
        person.moveToPosition(path[0]);
        return BehaviorTreeStatus.Running;
    };
}
