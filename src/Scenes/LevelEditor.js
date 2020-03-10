import "phaser";

import { BLOCK, BASE_TILE_WIDTH, BASE_TILE_HEIGHT } from "../constants";

const baseTileWidth = BASE_TILE_WIDTH; //8;
const baseTileHeight = BASE_TILE_HEIGHT; //12;

export default class LevelEditor extends Phaser.Scene {
    constructor() {
        super({
            key: "LevelEditor"
        });

        this.text = null;

        this.mouseX = 0;
        this.mouseY = 0;

        this.pointer = null;

        this.activeTool = null;

        this.onClickHandler = null;
        this.onHoverHandler = null;
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
            this.handleHover(this.mouseX, this.mouseY);
        });

        this.input.on("pointerdown", event => {
            this.mouseX = Math.floor(event.x / baseTileWidth);
            this.mouseY = Math.floor(event.y / baseTileHeight);

            this.handleHover(this.mouseX, this.mouseY);
            this.handleClick(this.mouseX, this.mouseY);
        });
    }

    handleHover(mouseX, mouseY) {
        if (this.onHoverHandler) {
            this.onHoverHandler(mouseX, mouseY);
        }
    }

    handleClick(mouseX, mouseY) {
        if (this.onClickHandler) {
            this.onClickHandler(mouseX, mouseY);
        }
    }

    setActiveTool(tool) {
        this.activeTool = tool;
    }

    update() {
        this.text.setText(`Tool: ${this.activeTool}`);
    }
}
