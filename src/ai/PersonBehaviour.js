import { BehaviorTreeBuilder } from "fluent-behavior-tree";

import WalkToDestination from "./actions/WalkToDestination";
import DecideDestination from "./actions/DecideDestination";

export default function(person) {
    const builder = new BehaviorTreeBuilder();
    return builder
        .sequence("Idle")
        .do("decideDestination", DecideDestination(person))
        .do("walkToDestination", WalkToDestination(person))
        .end()
        .build();
}
