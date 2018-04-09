import Phaser from "phaser";

import {
    WALL,
    ROAD,
    DOOR,
    DOOR_OPEN,
    DIRT_ROAD,
    BLOCK,
    HERO
} from "../constants";

class MainScene extends Phaser.Scene {
    constructor(world, onCreateDone) {
        super({
            key: "MainScene"
        });

        this.text = null;
        this.turn = 0;
        this.mouseX = 0;
        this.mouseY = 0;

        this.world = world;

        this.tiles = null;
        this.pathTiles = [];
        this.characters = null;
        this.objects = null;

        this.pointer = null;

        this.onClickHandler = null;
        this.onHoverHandler = null;

        this.onCreateDone = onCreateDone;
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
        this.pointer = this.add.image(0, 0, "atlas", BLOCK).setOrigin(0, 0);
        this.pointer.alpha = 0.2;
        this.pointer.setTint(0x0000ff);
        const tween = this.tweens.add({
            targets: this.pointer,
            alpha: 1,
            ease: "Power1",
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.tiles = [];
        for (let x = 0; x < 160; x++) {
            this.tiles.push([]);
            for (let y = 0; y < 45; y++) {
                this.tiles[x].push(
                    this.add
                        .image(
                            x * 8,
                            y * 12,
                            "atlas",
                            this.world.level[x][y].value
                        )
                        .setAlpha(0)
                        .setOrigin(0, 0)
                        .setTint(0x00ff00)
                );
            }
        }
        this.pathTiles = [];
        for (let x = 0; x < 120; x++) {
            this.pathTiles.push(
                this.add
                    .image(-5 * 8, -5 * 12, "atlas", 6)
                    .setAlpha(0)
                    .setOrigin(0, 0)
                    .setTint(0x0000ff)
            );
        }
        this.characters = this.world.people.map(person => {
            return this.add
                .image(
                    person.position.x * 8,
                    person.position.y * 12,
                    "chars",
                    1
                )
                .setOrigin(0, 0);
        });

        this.objects = this.world.objects.map(object => {
            console.log(object);
            return this.add
                .image(
                    object.position.x * 8,
                    object.position.y * 12,
                    "chars",
                    5
                )
                .setOrigin(0, 0);
        });

        this.hero = this.add
            .image(
                this.world.hero.position.x * 8,
                this.world.hero.position.y * 12,
                "chars",
                HERO
            )
            .setOrigin(0, 0);
        this.text = this.add
            .text(120, 50, "What", {
                font: "bold 19px Arial",
                fill: "#fff"
            })
            .setOrigin(0.5, 0.5);
        this.input.on("pointermove", event => {
            this.mouseX = Math.floor(event.x / 8);
            this.mouseY = Math.floor(event.y / 12);

            // this.tiles[this.mouseY][this.mouseX].setTexture("atlas", 1);
            this.pointer.x = this.mouseX * 8;
            this.pointer.y = this.mouseY * 12;
            this.onHoverHandler(this.mouseX, this.mouseY);
        });

        this.input.on("pointerdown", event => {
            // clicked on this
            this.mouseX = Math.floor(event.x / 8);
            this.mouseY = Math.floor(event.y / 12);

            this.onHoverHandler(this.mouseX, this.mouseY);
            this.onClickHandler(this.mouseX, this.mouseY);
        });

        this.onCreateDone();
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
        this.world = world;
        for (let y = 0; y < 45; y++) {
            for (let x = 0; x < 160; x++) {
                this.tiles[x][y].setTexture("atlas", world.level[x][y].value);
                if (world.level[x][y].visibility === 1) {
                    this.tweens.add({
                        targets: this.tiles[x][y],
                        alpha: world.level[x][y].visibility,
                        ease: "Power1",
                        duration: 250
                    });
                } else {
                    this.tiles[x][y].setAlpha(world.level[x][y].visibility);
                }
            }
        }

        world.people.forEach((person, i) => {
            this.characters[i].x = person.x * 8;
            this.characters[i].y = person.y * 12;
        });

        // this.hero.x = this.world.hero.x * 8;
        // this.hero.y = this.world.hero.y * 12;
        this.tweens.add({
            targets: this.hero,
            x: this.world.hero.x * 8,
            y: this.world.hero.y * 12,
            ease: "Power1",
            duration: 150
        });
    }

    updatePath(path) {
        if (!path) return;

        for (let y = 0; y < 45; y++) {
            for (let x = 0; x < 160; x++) {
                if (this.tiles[x][y]) {
                    this.tiles[x][y].setAlpha(
                        this.world.level[x][y].visibility
                    );
                }
            }
        }

        this.pathTiles.forEach((pathTile, i) => {
            if (i >= this.world.currentIndex && i < path.length) {
                pathTile.x = path[i].col * 8;
                pathTile.y = path[i].row * 12;
                pathTile.setAlpha(1);
                if (this.world.hero.gunAimed) {
                    pathTile.setTint(0xff0000);
                } else {
                    pathTile.setTint(0x0000ff);
                }
            } else {
                pathTile.setAlpha(0);
            }
        });
    }
}

export default MainScene;
