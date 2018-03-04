import Phaser from "phaser";

import { WALL, ROAD, DOOR, DOOR_OPEN, DIRT_ROAD } from "../constants";

class MainScene extends Phaser.Scene {
    constructor(world) {
        super({
            key: "MainScene"
        });

        this.text = null;
        this.turn = 0;
        this.mouseX = 0;
        this.mouseY = 0;

        this.world = world;

        this.tiles = null;
        this.characters = null;

        this.onClickHandler = null;
        this.onHoverHandler = null;
    }

    preload() {
        this.load.spritesheet("atlas", "assets/tokhang-rl.png", {
            frameWidth: 8,
            frameHeight: 12
        });
        this.load.spritesheet("chars", "assets/tokhang-chars.png", {
            frameWidth: 8,
            frameHeight: 12
        });
    }

    create() {
        this.tiles = [];
        for (let y = 0; y < 45; y++) {
            this.tiles.push([]);
            for (let x = 0; x < 160; x++) {
                this.tiles[y].push(
                    this.add
                        .image(x * 8, y * 12, "atlas", this.world.level[y][x])
                        .setOrigin(0, 0)
                );
            }
        }
        this.characters = this.world.people.map(person => {
            console.log("Person", person.position.x, person.position.y);
            return this.add
                .image(
                    person.position.x * 8,
                    person.position.y * 12,
                    "chars",
                    1
                )
                .setOrigin(0, 0);
        });
        this.text = this.add
            .text(120, 50, "What", {
                font: "bold 19px Arial",
                fill: "#fff"
            })
            .setOrigin(0.5, 0.5);
        this.input.on("pointermove", event => {
            this.mouseX = Math.floor(event.x / 8);
            this.mouseY = Math.floor(event.y / 12);

            this.tiles[this.mouseY][this.mouseX].setTexture("atlas", 1);
            this.onHoverHandler(this.mouseX, this.mouseY);
        });

        this.input.on("pointerdown", event => {
            // clicked on this
            this.mouseX = Math.floor(event.x / 8);
            this.mouseY = Math.floor(event.y / 12);

            this.onHoverHandler(this.mouseX, this.mouseY);
            this.onClickHandler(this.mouseX, this.mouseY);
        });
    }

    update() {
        this.text.setText(
            `The turn: ${this.turn}, ${this.mouseX}, ${this.mouseY}`
        );
    }

    setTurn() {
        this.turn += 1;
    }

    onClick(clickHandler) {
        this.onClickHandler = clickHandler;
    }

    onHover(hoverHandler) {
        this.onHoverHandler = hoverHandler;
    }

    updateWorld(world) {
        for (let y = 0; y < 45; y++) {
            for (let x = 0; x < 160; x++) {
                this.tiles[y][x].setTexture("atlas", world.level[y][x]);
            }
        }

        world.people.forEach((person, i) => {
            this.characters[i].x = person.x * 8;
            this.characters[i].y = person.y * 12;
        });
    }
}

export default MainScene;
