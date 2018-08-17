import "phaser";

const CELL_WIDTH = 40;
const CELL_HEIGHT = 40;
const WORLD_WIDTH = 10;
const WORLD_HEIGHT = 8;

class Vector2 {
    constructor(x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }
}

class Cell {
    row = 0;
    col = 0;
    passable = false;
    constructor({ row, col, passable }) {
        this.row = row;
        this.col = col;
        this.x = parseInt(col);
        this.y = parseInt(row);
        this.passable = !passable;
        this.distance = null;
    }
}

export default class FlowField extends Phaser.Scene {
    square = new Phaser.Geom.Rectangle(0, 0, CELL_WIDTH, CELL_HEIGHT);

    constructor() {
        super({
            key: "FlowField"
        });
        this.text = null;
        this.graphics = null;

        this.cells = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.world = [];
    }

    create() {
        // generate a random grid
        for (let col in this.cells) {
            this.world[col] = [];
            for (let row in this.cells[col]) {
                this.world[col].push(
                    new Cell({
                        row,
                        col,
                        passable: this.cells[col][row]
                    })
                );
            }
        }

        console.log(this.world);

        this.text = this.add
            .text(120, 50, "What", {
                font: "bold 19px Arial",
                fill: "#fff"
            })
            .setOrigin(0.5, 0.5);

        this.graphics = this.add.graphics({
            lineStyle: {
                width: 10,
                color: "#00ff00"
            }
        });

        this.generateDijkstraGrid();

        for (let row in this.world) {
            for (let col in this.world[row]) {
                const cell = this.world[row][col];
                console.log(cell.distance);
                cell.text = this.add.text(
                    col * CELL_WIDTH,
                    row * CELL_HEIGHT,
                    cell.distance
                );
            }
        }
    }

    generateDijkstraGrid() {
        function neighboursOf(v) {
            var res = [];
            if (v.x > 0) {
                res.push(new Vector2(v.x - 1, v.y));
            }
            if (v.y > 0) {
                res.push(new Vector2(v.x, v.y - 1));
            }

            if (v.x < WORLD_WIDTH - 1) {
                res.push(new Vector2(v.x + 1, v.y));
            }
            if (v.y < WORLD_HEIGHT - 1) {
                res.push(new Vector2(v.x, v.y + 1));
            }

            return res;
        }

        const pathend = {
            x: 5,
            y: 2
        };

        this.world[pathend.y][pathend.x].weight = 0;
        const toVisit = [this.world[pathend.y][pathend.x]];

        //for each node we need to visit, starting with the pathEnd
        for (let i = 0; i < toVisit.length; i++) {
            var neighbours = neighboursOf(toVisit[i]);

            //for each neighbour of this node (only straight line neighbours, not diagonals)
            for (var j = 0; j < neighbours.length; j++) {
                var n = neighbours[j];
                console.log(n);
                //We will only ever visit every node once as we are always visiting nodes in the most efficient order
                if (this.world[n.y][n.x].distance === null) {
                    n.distance = toVisit[i].distance + 1;
                    this.world[n.y][n.x].distance = n.distance;
                    toVisit.push(n);
                }
            }
        }
    }

    update() {
        this.graphics.clear();

        for (let row in this.world) {
            for (let col in this.world[row]) {
                const cell = this.world[row][col];
                let fillStyle = 0xccccff;
                if (cell.passable) {
                    fillStyle = 0x0ff00f;
                }
                this.square.setTo(
                    col * CELL_WIDTH,
                    row * CELL_HEIGHT,
                    CELL_WIDTH,
                    CELL_HEIGHT
                );
                this.graphics.fillStyle(fillStyle);
                this.graphics.fillRectShape(this.square);
                this.graphics.strokeRect(
                    this.square.x,
                    this.square.y,
                    this.square.width,
                    this.square.height
                );
            }
        }
    }
}
