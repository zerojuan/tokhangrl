import "phaser";

import {
    WALL,
    DOOR,
    DOOR_OPEN,
    ROAD,
    DIRT_ROAD,
    BLOCK,
    EXIT,
    BASE_TILE_WIDTH,
    BASE_TILE_HEIGHT,
    TOOL_HOUSE,
    TOOL_ROAD,
    ROWS,
    COLS
} from "../constants";

import { doesRoomOverlap, generateID } from "../RL/WorldUtil";

const baseTileWidth = BASE_TILE_WIDTH; //8;
const baseTileHeight = BASE_TILE_HEIGHT; //12;

export default class LevelEditor extends Phaser.Scene {
    constructor() {
        super({
            key: "LevelEditor"
        });

        this.levelData = {
            houses: [],
            roads: []
        };

        this.layer1 = [];

        this.text = null;

        this.mouseX = 0;
        this.mouseY = 0;

        this.pointer = null;

        this.activeTool = null;
        this.activeToolParams = null;

        this.parentClickHandler = null;
        this.parentHoverHandler = null;
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

        const initLayer = () => {
            const layer = [];
            for (let x = 0; x < COLS; x++) {
                layer.push([]);
                for (let y = 0; y < ROWS; y++) {
                    layer[x].push(
                        this.add
                            .image(
                                x * baseTileWidth,
                                y * baseTileHeight,
                                "atlas",
                                DIRT_ROAD
                            )
                            .setAlpha(0.5)
                            .setOrigin(0, 0)
                            .setTint(0x00ff00)
                    );
                }
            }
            return layer;
        };

        this.layer1 = initLayer();

        this.tempLayer = initLayer();

        this.text = this.add
            .text(50, 20, "What", {
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

    overlaps(thing, things) {
        const found = things.find(item => {
            return doesRoomOverlap(item, thing);
        });

        return !!found;
    }

    getThing(x, y, things) {
        // loop through the list of houses, check if the x,y is within bounds
        const found = things.find(item => {
            return doesRoomOverlap(item, {
                x,
                y,
                width: 1,
                height: 1
            });
        });
        return found;
    }

    clearLayer(layer) {
        for (let x = 0; x < COLS; x++) {
            for (let y = 0; y < ROWS; y++) {
                this.tempLayer[x][y].setTexture("atlas", DIRT_ROAD).setAlpha(0);
            }
        }
        return layer;
    }

    handleHover(mouseX, mouseY) {
        if (this.activeTool === TOOL_HOUSE) {
            // temp layer
            this.levelData.tempHouse = {
                x: mouseX,
                y: mouseY,
                width: this.activeToolParams.width,
                height: this.activeToolParams.height,
                valid: true
            };

            // check if this overlaps with any of the houses
            if (
                this.overlaps(this.levelData.tempHouse, this.levelData.houses)
            ) {
                this.levelData.tempHouse.valid = false;
            }
        } else if (this.activeTool === TOOL_ROAD) {
        }

        if (this.parentHoverHandler) {
            this.parentHoverHandler(mouseX, mouseY);
        }
    }

    handleClick(mouseX, mouseY) {
        // check if there is an active tool, and what are the parameters of the active tool
        // activeToolParameters from activeTool object?
        if (this.activeTool === TOOL_HOUSE) {
            // create a house here
            if (this.levelData.tempHouse && this.levelData.tempHouse.valid) {
                const house = {
                    id: generateID(),
                    x: mouseX,
                    y: mouseY,
                    width: this.activeToolParams.width,
                    height: this.activeToolParams.height
                };
                console.log("Add house:", house);
                this.levelData.houses.push(house);
            }
        } else if (this.activeTool === TOOL_ROAD) {
        } else {
            // check if you are clicking a house
            const house = this.getThing(mouseX, mouseY, this.levelData.houses);
            if (house) {
                console.log("I am a house", house);
            }
        }

        if (this.parentClickHandler) {
            this.parentClickHandler(mouseX, mouseY);
        }
    }

    getLevelData() {
        return this.levelData;
    }

    setActiveTool(tool) {
        this.activeTool = tool;
        if (!tool) {
            this.levelData.tempHouse = null;
        }
        this.activeToolParams = {};
    }

    setActiveToolParams(params) {
        this.activeToolParams = params;
    }

    update() {
        this.text.setText(`Tool: ${this.activeTool}`);

        // render houses
        this.levelData.houses.forEach(house => {
            for (let x = house.x; x < house.x + house.width; x++) {
                for (let y = house.y; y < house.y + house.height; y++) {
                    this.layer1[x][y].setTexture("atlas", BLOCK);
                }
            }
        });

        this.clearLayer(this.tempLayer);
        if (this.levelData.tempHouse) {
            const { tempHouse } = this.levelData;
            for (let x = tempHouse.x; x < tempHouse.x + tempHouse.width; x++) {
                for (
                    let y = tempHouse.y;
                    y < tempHouse.y + tempHouse.height;
                    y++
                ) {
                    const cell = this.tempLayer[x][y];
                    cell.setTexture("atlas", BLOCK).setAlpha(1);
                    cell.setTint(tempHouse.valid ? 0x00ff00 : 0xff0000);
                }
            }
        }

        if (this.activeTool) {
            this.text.setText(`Width: ${this.activeToolParams.width}`);
        }
    }
}
