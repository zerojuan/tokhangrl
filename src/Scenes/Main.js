import Phaser from "phaser";

import {
    WALL,
    ROAD,
    DOOR,
    DOOR_OPEN,
    DIRT_ROAD,
    BLOCK,
    HERO,
    ROWS,
    COLS,
    BASE_TILE_WIDTH,
    BASE_TILE_HEIGHT
} from "../constants";

import DebugHelper from "./DebugHelper";

// TODO: double the sprite size
const baseTileWidth = BASE_TILE_WIDTH; //8;
const baseTileHeight = BASE_TILE_HEIGHT; //12;

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
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("chars", "assets/tokhang-chars.png", {
            frameWidth: 16,
            frameHeight: 16
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
        for (let x = 0; x < COLS; x++) {
            this.tiles.push([]);
            for (let y = 0; y < ROWS; y++) {
                this.tiles[x].push(
                    this.add
                        .image(
                            x * baseTileWidth,
                            y * baseTileHeight,
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
                    .image(-5 * baseTileWidth, -5 * baseTileHeight, "atlas", 6)
                    .setAlpha(0)
                    .setOrigin(0, 0)
                    .setTint(0x0000ff)
            );
        }
        this.characters = this.world.people.map(person => {
            return this.add
                .image(
                    person.position.x * baseTileWidth,
                    person.position.y * baseTileHeight,
                    "chars",
                    person.type
                )
                .setOrigin(0, 0);
        });

        this.objects = this.world.objects.map(thing => {
            return this.add
                .image(
                    thing.position.x * baseTileWidth,
                    thing.position.y * baseTileHeight,
                    "atlas",
                    thing.value
                )
                .setOrigin(0, 0);
        });

        this.hero = this.add
            .image(
                this.world.hero.position.x * baseTileWidth,
                this.world.hero.position.y * baseTileHeight,
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
            this.mouseX = Math.floor(event.x / baseTileWidth);
            this.mouseY = Math.floor(event.y / baseTileHeight);

            // this.tiles[this.mouseY][this.mouseX].setTexture("atlas", 1);
            this.pointer.x = this.mouseX * baseTileWidth;
            this.pointer.y = this.mouseY * baseTileHeight;
            this.onHoverHandler(this.mouseX, this.mouseY);
        });

        this.input.on("pointerdown", event => {
            // clicked on this
            this.mouseX = Math.floor(event.x / baseTileWidth);
            this.mouseY = Math.floor(event.y / baseTileHeight);

            this.onHoverHandler(this.mouseX, this.mouseY);
            this.onClickHandler(this.mouseX, this.mouseY);
        });

        this.keyDebug = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        this.debugHelper = DebugHelper(this, {
            tileWidth: baseTileWidth,
            tileHeight: baseTileHeight
        });

        this.onCreateDone();
    }

    update() {
        this.text.setText(
            `The turn: ${this.turn}, ${this.mouseX}, ${this.mouseY}`
        );

        this.debug(this.keyDebug.isDown);

        this.redrawWorld();
    }

    debug(show) {
        if (show) {
            this.debugHelper.showDebug(this.world);
        } else {
            this.debugHelper.hideDebug();
        }
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

    redrawWorld() {
        const { world } = this;
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
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

        world.objects.forEach((thing, i) => {
            this.objects[i].setTexture("atlas", thing.value);
            this.objects[i].setAlpha(
                world.level[thing.position.x][thing.position.y].visibility
            );
        });

        world.people.forEach((person, i) => {
            this.characters[i].x = person.x * baseTileWidth;
            this.characters[i].y = person.y * baseTileHeight;
            this.characters[i].setAlpha(
                world.level[person.x][person.y].visibility
            );

            // TODO: set sprite animation depend on state of the person
        });

        // this.hero.x = this.world.hero.x * 8;
        // this.hero.y = this.world.hero.y * 12;
        this.tweens.add({
            targets: this.hero,
            x: this.world.hero.x * baseTileWidth,
            y: this.world.hero.y * baseTileHeight,
            ease: "Power1",
            duration: 150
        });
    }

    updateWorld(world) {
        this.world = world;
    }

    updatePath(path) {
        if (!path) return;

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (this.tiles[x][y]) {
                    this.tiles[x][y].setAlpha(
                        this.world.level[x][y].visibility
                    );
                }
            }
        }

        this.pathTiles.forEach((pathTile, i) => {
            if (i >= this.world.currentIndex && i < path.length) {
                pathTile.x = path[i].col * baseTileWidth;
                pathTile.y = path[i].row * baseTileHeight;
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
