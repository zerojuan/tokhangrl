import { BehaviorTreeStatus } from "fluent-behavior-tree";

export default function(person) {
    return async world => {
        person.currentBehaviour = "DecideDestination";
        // person.destination = {
        //     col: Math.floor(Math.random() * 20),
        //     row: Math.floor(Math.random() * 20)
        // };

        const rooms = world.rooms;

        // pick a place

        person.destination =
            world.rooms[Math.floor(Math.random() * rooms.length)];

        // decide destination based on status of the world

        return BehaviorTreeStatus.Success;
    };
}
