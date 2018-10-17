import { COLS, ROWS } from "../constants";

function getNeighbors(v, map) {
    var res = [];
    if (v.x > 0) {
        res.push(map[v.x - 1][v.y]); // west
        // res.push(new Vector2(v.x - 1, v.y));
    }
    if (v.y > 0) {
        res.push(map[v.x][v.y - 1]); // north
        // res.push(new Vector2(v.x, v.y - 1));
    }

    console.log(v);
    if (v.x < COLS - 1) {
        res.push(map[v.x + 1][v.y]); // east
        // res.push(new Vector2(v.x + 1, v.y));
    }
    if (v.y < ROWS - 1) {
        res.push(map[v.x][v.y + 1]); // south
        // res.push(new Vector2(v.x, v.y + 1));
    }

    return res;
}

export function generateDijkstraGrid(world, { destX, destY, width, height }) {
    const map = [];
    const { level } = world;
    console.log(`Destination: ${destX}, ${destY}`);

    for (let col in level) {
        map.push([]);
        for (let row in level[col]) {
            const tile = level[col][row];
            map[col].push({
                x: parseInt(col, 10),
                y: parseInt(row, 10),
                distance: tile.passable ? 99 : null
            });
        }
    }

    const pathend = {
        x: parseInt(destX),
        y: parseInt(destY)
    };

    const toVisit = [];

    for (let startX = 0; startX < width; startX++) {
        for (let startY = 0; startY < height; startY++) {
            if (map[destX + startX][destY + startY].distance === null) {
                map[destX + startX][destY + startY].distance = 0;
                toVisit.push(map[destX + startX][destY + startY]);
            }
        }
    }
    // this.world[pathend.y][pathend.x].distance = 0;
    // this.world[pathend.y + 1][pathend.x].distance = 0;
    // this.world[pathend.y - 1][pathend.x].distance = 0;
    // const toVisit = [
    //     this.world[pathend.y][pathend.x],
    //     this.world[pathend.y + 1][pathend.x],
    //     this.world[pathend.y - 1][pathend.x]
    // ];
    // const toVisit = [map[pathend.x][pathend.y]];

    //for each node we need to visit, starting with the pathEnd
    for (let i = 0; i < toVisit.length; i++) {
        const neighbours = getNeighbors(toVisit[i], map);
        //for each neighbour of this node (only straight line neighbours, not diagonals)
        for (let j = 0; j < neighbours.length; j++) {
            const n = neighbours[j];

            //We will only ever visit every node once as we are always visiting nodes in the most efficient order
            if (map[n.x][n.y].distance === null) {
                map[n.x][n.y].distance = toVisit[i].distance + 1;
                toVisit.push(n);
            }
        }
    }

    return map;
}

export function generateDijkstraGridByRoom(world, room) {
    const result = generateDijkstraGrid(world, {
        destX: room.x + 1,
        destY: room.y + 1,
        width: room.width,
        height: room.height
    });
    return result;
}
