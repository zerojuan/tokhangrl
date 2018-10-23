import { BehaviorTreeStatus } from "fluent-behavior-tree";

// import { findPath } from "../../RL/Pathfinder";
import { findPath } from "../../RL/FlowfieldGenerator";

export default function(person) {
    return async world => {
        person.currentBehaviour = "WalkToDestination";

        person.idleTurns = 0;

        const destination = person.destination;

        // world should keep an array of destinations
        // world.getDijkstraFill(destination)
        // findPath should be dijkstra based now
        // findPath({person.x,person.y}, dijkstraFillOutput);
        const path = findPath(
            {
                x: person.x,
                y: person.y
            },
            person.destination.map,
            world
        );

        if (!path) {
            return BehaviorTreeStatus.Failure;
        }

        if (path.distance <= 3) {
            return BehaviorTreeStatus.Success;
        }

        // console.log(
        //     `Moving... ${person.name} to ${path[0].col},${path[0].row}`
        // );

        // is position occupied?
        // if (!world.hasPerson(path[0])) {
        person.moveToPosition({
            row: path.y,
            col: path.x
        });
        // }
        // i'm done moving?
        return BehaviorTreeStatus.Running;
    };
}
