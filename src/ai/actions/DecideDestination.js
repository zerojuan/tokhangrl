import { BehaviorTreeStatus } from "fluent-behavior-tree";

export default function(person) {
    return async world => {
        person.destination = { col: 20, row: 20 };

        return BehaviorTreeStatus.Success;
    };
}
