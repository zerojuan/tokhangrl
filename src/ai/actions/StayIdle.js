import { BehaviorTreeStatus } from "fluent-behavior-tree";

export default function(person) {
    return async world => {
        person.currentBehaviour = "StayIdle";
        person.idleTurns++;
        person.destination = null;
        console.log("Staying idle", person.name);
        if (person.idleTurns >= person.maxIdle) {
            return BehaviorTreeStatus.Success;
        }

        return BehaviorTreeStatus.Running;
    };
}
