import Phaser from "phaser";

import { ROWS, COLS } from "../constants";

export default function(scene, { tileWidth, tileHeight }) {
    const graphics = scene.add.graphics({
        lineStyle: {
            width: 10,
            color: "#00ff00"
        }
    });

    const circle = new Phaser.Geom.Circle(20, 20, 20);
    const line = new Phaser.Geom.Line(100, 500, 700, 100);
    const rect = new Phaser.Geom.Rectangle(10, 10, 10, 10);

    const toWorldPoint = (x, y) => {
        return {
            x: x * tileWidth + tileWidth / 2,
            y: y * tileHeight + tileHeight / 2
        };
    };

    const showDebug = function(world, mouseX, mouseY) {
        graphics.clear();

        // see if we are hovering over a person
        const person = world.people.find(person => {
            return person.x === mouseX && person.y === mouseY;
        });
        if (person) {
            // find person's destination
            const personDestination = person.destination;

            if (personDestination) {
                // generate person's field
                const map = personDestination.map;
                for (const col in map) {
                    for (const row in map[col]) {
                        const destinationPoint = toWorldPoint(col, row);
                        circle.setTo(
                            destinationPoint.x,
                            destinationPoint.y,
                            tileHeight / 4
                        );
                        if (map[col][row].distance > 0) {
                            graphics.fillStyle(
                                0x00ff00,
                                map[col][row].distance / 100
                            );
                            graphics.fillCircleShape(circle);
                        }
                    }
                }
            }
        }
        // if we are, then show the field

        // for (let y = 0; y < ROWS; y++) {
        //     for (let x = 0; x < COLS; x++) {
        //         const point = toWorldPoint(x, y);
        //         if (world.level[x][y].occupied) {
        //             circle.setTo(point.x, point.y, tileHeight / 4);
        //             graphics.fillStyle(0xff0000);
        //             graphics.fillCircleShape(circle);
        //         } else if (world.level[x][y].solid) {
        //             circle.setTo(point.x, point.y, tileHeight / 4);
        //             graphics.fillStyle(0x330000);
        //             graphics.fillCircleShape(circle);
        //         }
        //     }
        // }
        // world.rooms.forEach(room => {
        //     if (!room.map) {
        //         return;
        //     }
        //     const map = room.map;
        //     for (const col in map) {
        //         for (const row in map[col]) {
        //             const destinationPoint = toWorldPoint(col, row);
        //             circle.setTo(
        //                 destinationPoint.x,
        //                 destinationPoint.y,
        //                 tileHeight / 4
        //             );
        //             if (map[col][row].distance > 0) {
        //                 graphics.fillStyle(
        //                     0x00ff00,
        //                     map[col][row].distance / 100
        //                 );
        //                 graphics.fillCircleShape(circle);
        //             }
        //         }
        //     }
        // });

        world.rooms.forEach(room => {
            room.debug(graphics, rect, tileWidth, tileHeight);
        });

        world.people.forEach(person => {
            const point = toWorldPoint(person.x, person.y);
            if (person.idleTurns > 0) {
                circle.setTo(point.x, point.y, tileHeight / 4);
                graphics.fillStyle(0x00ff00);
                graphics.fillCircleShape(circle);
            }
            if (person.destination) {
                const destinationPoint = toWorldPoint(
                    person.destination.x,
                    person.destination.y
                );
                circle.setTo(
                    destinationPoint.x,
                    destinationPoint.y,
                    tileHeight / 4
                );
                graphics.fillStyle(0x0000ff);
                graphics.fillCircleShape(circle);
                line.setTo(
                    point.x,
                    point.y,
                    destinationPoint.x,
                    destinationPoint.y
                );
                graphics.strokeLineShape(line);
            }
        });
    };

    const hideDebug = () => {
        graphics.clear();
    };

    return {
        showDebug,
        hideDebug
    };
}
