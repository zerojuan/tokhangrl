import { BehaviorTreeBuilder } from "fluent-behavior-tree";

import WalkToDestination from "./actions/WalkToDestination";
import DecideDestination from "./actions/DecideDestination";
import StayIdle from "./actions/StayIdle";

export default function(person) {
    const builder = new BehaviorTreeBuilder();
    return builder
        .sequence("Idle")
        .do("decideDestination", DecideDestination(person))
        .do("walkToDestination", WalkToDestination(person))
        .do("stayIdle", StayIdle(person))
        .end()
        .build();
}
