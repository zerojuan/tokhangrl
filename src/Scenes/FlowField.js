import "phaser";

const CELL_WIDTH = 40;
const CELL_HEIGHT = 40;
const WORLD_WIDTH = 10;
const WORLD_HEIGHT = 8;

class Vector2 {
    constructor(x, y) {
        this.x = parseInt(x, 10);
        this.y = parseInt(y, 10);
    }
}

class Cell {
    row = 0;
    col = 0;
    passable = false;
    constructor({ row, col, passable }) {
        this.row = parseInt(row);
        this.col = parseInt(col);
        this.x = this.col;
        this.y = this.row;
        this.passable = !passable;
        this.distance = !this.passable ? 99 : null;
        this.occupants = 0;
    }
}

class Monster {
    row = 0;
    col = 0;
    constructor({ row, col, color, scene }) {
        this.row = parseInt(row, 10);
        this.col = parseInt(col, 10);

        this.x = this.col;
        this.y = this.row;
        
        this.color = color;

        this.scene = scene;
        this.sprite = new Phaser.Geom.Circle(0, 0, 10);
        this.update();
    }

    move(world, monsters) {
        // get the neighbors
        const currCell = world[this.y][this.x];
        if (currCell.distance === 0) {
            return;
        }

        const neighbors = getNeighbors(this, world);
        let nearestNeighbor = neighbors[0];
        for (const neighbor of neighbors) {
        	const monsterWeight = findMonsterOnCell( neighbor.x, neighbor.y, monsters ) ? 99 : 0;
        	const totalDistance = neighbor.distance + monsterWeight;
            if (totalDistance === 0) {
                nearestNeighbor = neighbor;
                break;
            }
            if (totalDistance <= nearestNeighbor.distance) {
                nearestNeighbor = neighbor;
            }
        }
        
        // check if the nearestNeighbor has a monster in them
//        if ( findMonsterOnCell( nearestNeighbor.x, nearestNeighbor.y, monsters ) ) {
//        	return;
//        }
        
        this.x = nearestNeighbor.x;
        this.y = nearestNeighbor.y;
        // console.log(nearestNeighbor.distance);
        this.col = this.x;
        this.row = this.y;
    }

    update() {
        this.sprite.setTo(
            this.x * CELL_WIDTH + CELL_WIDTH / 2,
            this.y * CELL_HEIGHT + CELL_HEIGHT / 2,
            10
        );
    }
}

function getNeighbors(v, world) {
    var res = [];
    if (v.x > 0) {
        res.push(world[v.y][v.x - 1]);
        // res.push(new Vector2(v.x - 1, v.y));
    }
    if (v.y > 0) {
        res.push(world[v.y - 1][v.x]);
        // res.push(new Vector2(v.x, v.y - 1));
    }

    if (v.x < WORLD_WIDTH - 1) {
        res.push(world[v.y][v.x + 1]);
        // res.push(new Vector2(v.x + 1, v.y));
    }
    if (v.y < WORLD_HEIGHT - 1) {
        res.push(world[v.y + 1][v.x]);
        // res.push(new Vector2(v.x, v.y + 1));
    }

    return res;
}

function findMonsterOnCell(x,y, monsters) {
	const m = monsters.find((monster) => {
		return monster.col === x && monster.row === y;
	});
	return m;
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
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.world = [];

        this.monsters = [];
    }

    create() {
        // generate a random grid
        for (let row in this.cells) {
            this.world[row] = [];
            for (let col in this.cells[row]) {
                this.world[row].push(
                    new Cell({
                        row,
                        col,
                        passable: this.cells[row][col]
                    })
                );
            }
        }

        this.graphics = this.add.graphics({
            lineStyle: {
                width: 1,
                color: "#00ff00"
            }
        });

        this.generateDijkstraGrid({ destX: 5, destY: 2 });
        this.updateLabels();

        this.input.on("pointerdown", event => {
            // clicked on this
            this.mouseX = Math.floor(event.x / CELL_WIDTH);
            this.mouseY = Math.floor(event.y / CELL_HEIGHT);

            for (const monster of this.monsters) {
                monster.y = Math.floor(Math.random() * WORLD_HEIGHT);
                monster.x = Math.floor(Math.random() * WORLD_WIDTH);
            }

            const startTime = Date.now();
            this.generateDijkstraGrid({
                destX: this.mouseX,
                destY: this.mouseY
            });
            this.text.setText(`TIME: ${Date.now() - startTime}ms`);

            this.updateLabels();
        });

        this.text = this.add.text(5, 20, "What", {
            font: "bold 12px Arial",
            fill: "#000"
        });

        this.monsters = [];
        for (let i = 0; i < 15; i++) {
            const monster = new Monster({
                row: Math.floor(Math.random() * WORLD_HEIGHT),
                col: Math.floor(Math.random() * WORLD_WIDTH),
                color: Math.random()*16777215,
                scene: this
            });
            this.monsters.push(monster);
        }

        this.turnEvent = this.time.addEvent({
            delay: 100,
            callback: this.onTurn,
            callbackScope: this,
            loop: true
        });
    }

    onTurn() {
        // calculate monster steps
        for (const monster of this.monsters) {
            monster.move(this.world, this.monsters);
        }
        // update occupants in map
        for (let row in this.world) {
            for (let col in this.world[row]) {
                const cell = this.world[row][col];
                cell.occupants = 0;
            }
        }
		for (const monster of this.monsters) {
			const cell = this.world[monster.row][monster.col];
			cell.occupants += 1;
		}
        
    }

    updateLabels() {
        for (let row in this.world) {
            for (let col in this.world[row]) {
                const cell = this.world[row][col];
                if (!cell.text) {
                    cell.text = this.add.text(
                        col * CELL_WIDTH,
                        row * CELL_HEIGHT,
                        cell.distance
                    );
                }
                cell.text.setText(cell.distance + ' ' + cell.occupants);
            }
        }
    }

    generateDijkstraGrid({ destX = 0, destY = 0 }) {
        for (let row in this.world) {
            for (let col in this.world[row]) {
                const cell = this.world[row][col];
                cell.distance = !cell.passable ? 99 : null;
            }
        }

        const pathend = {
            x: destX,
            y: destY
        };

        this.world[pathend.y][pathend.x].distance = 0;
        const toVisit = [this.world[pathend.y][pathend.x]];

        //for each node we need to visit, starting with the pathEnd
        for (let i = 0; i < toVisit.length; i++) {
            var neighbours = getNeighbors(toVisit[i], this.world);

            //for each neighbour of this node (only straight line neighbours, not diagonals)
            for (var j = 0; j < neighbours.length; j++) {
                var n = neighbours[j];

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
        // this.graphics.clear();
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

        for (const monster of this.monsters) {
            monster.update();
            this.graphics.fillStyle(monster.color);
            this.graphics.fillCircleShape(monster.sprite);
        }
        
        this.updateLabels();
    }
}
