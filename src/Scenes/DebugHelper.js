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

    const toWorldPoint = (x, y) => {
        return {
            x: x * tileWidth + tileWidth / 2,
            y: y * tileHeight + tileHeight / 2
        };
    };

    const showDebug = function(world) {
        // graphics.clear();

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

        world.people.forEach(person => {
            const point = toWorldPoint(person.x, person.y);
            if (person.idleTurns > 0) {
                circle.setTo(point.x, point.y, tileHeight / 4);
                graphics.fillStyle(0x00ff00);
                graphics.fillCircleShape(circle);
            }

            if (person.destination) {
                const destinationPoint = toWorldPoint(
                    person.destination.col,
                    person.destination.row
                );
                console.log(destinationPoint);
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
