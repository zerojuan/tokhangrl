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

function findPeopleOnCell(x, y, people) {
    const m = people.find(monster => {
        return monster.x === x && monster.y === y;
    });
    return m;
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

export function findPath(position, map, world) {
    const currCell = map[position.x][position.y];
    const people = world.people;
    // if (currCell.distance === 0) {
    //     return;
    // }

    const neighbors = getNeighbors(position, map);
    let nearestNeighbor = neighbors[0];
    for (const neighbor of neighbors) {
        // if there's a monster in the destination, then add high cost to move there
        const monsterWeight = findPeopleOnCell(neighbor.x, neighbor.y, people)
            ? 99
            : 0;
        const totalDistance = neighbor.distance + monsterWeight;
        if (totalDistance === 0) {
            nearestNeighbor = neighbor;
            break;
        }
        if (totalDistance <= nearestNeighbor.distance) {
            nearestNeighbor = neighbor;
        }
    }

    // the nearest neighbor happened to be occupied
    if (
        findPeopleOnCell(nearestNeighbor.x, nearestNeighbor.y, people) &&
        nearestNeighbor.distance <= 3
    ) {
        return;
    }

    return {
        x: nearestNeighbor.x,
        y: nearestNeighbor.y,
        distance: nearestNeighbor.distance
    };
}
