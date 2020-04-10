import { WALL } from "../constants";

function getNeighbors({ x, y }, level) {
    const neighbors = {
        N: null,
        S: null,
        E: null,
        W: null
    };

    if (level[x] && level[x][y - 1]) {
        neighbors.N = level[x][y - 1];
    }

    if (level[x + 1] && level[x + 1][y]) {
        neighbors.E = level[x + 1][y];
    }

    if (level[x - 1] && level[x - 1][y]) {
        neighbors.W = level[x - 1][y];
    }

    if (level[x] && level[x][y + 1]) {
        neighbors.S = level[x][y + 1];
    }

    return neighbors;
}

export function generateID() {
    return Math.random()
        .toString(36)
        .substring(7);
}

export function oppositesFree({ x, y }, level) {
    const neighbors = getNeighbors({ x, y }, level);
    let openCount = 0;

    function isOppositesFree(start, opposite) {
        if (start) {
            if (opposite) {
                return start.value !== WALL && opposite.value !== WALL;
            }
        }
        return false;
    }

    if (isOppositesFree(neighbors.N, neighbors.S)) {
        openCount++;
    }
    if (isOppositesFree(neighbors.S, neighbors.N)) {
        openCount++;
    }
    if (isOppositesFree(neighbors.E, neighbors.W)) {
        openCount++;
    }
    if (isOppositesFree(neighbors.W, neighbors.E)) {
        openCount++;
    }

    return openCount >= 1;
}

export function isCorner({ x, y }, level) {
    const neighbors = getNeighbors({ x, y }, level);
    let openCount = 0;

    function isOppositeFree(start, opposite) {
        if (start) {
            if (opposite) {
                console.log(
                    start.value !== WALL && opposite.value !== WALL,
                    { x: start.x, y: start.y },
                    { x: opposite.x, y: opposite.y },
                    "what"
                );
                return start.value !== WALL && opposite.value !== WALL;
            }
        }
        console.log("Not OppositeFree: ", start);
        return false;
    }

    if (isOppositeFree(neighbors.N, neighbors.S)) {
        openCount++;
    }
    if (isOppositeFree(neighbors.S, neighbors.N)) {
        openCount++;
    }
    if (isOppositeFree(neighbors.E, neighbors.W)) {
        openCount++;
    }
    if (isOppositeFree(neighbors.W, neighbors.E)) {
        openCount++;
    }
    console.log("IsCorner", x, y, openCount);

    return openCount === 2;
}

export function isMiddle({ x, y }, level) {
    const neighbors = getNeighbors({ x, y }, level);
    // check if this is in the middle
    console.log("ISMiddle", x, y, neighbors);
    function isWall(tile) {
        return tile && tile.value === WALL;
    }
    return (
        isWall(neighbors.N) &&
        isWall(neighbors.S) &&
        isWall(neighbors.E) &&
        isWall(neighbors.W)
    );
}

export function doesRoomOverlap(roomA, roomB) {
    function overlaps(r1, r2) {
        const rect1 = {
            x1: r1.x,
            y1: r1.y,
            x2: r1.x + (r1.width - 1),
            y2: r1.y + (r1.height - 1)
        };
        const rect2 = {
            x1: r2.x,
            y1: r2.y,
            x2: r2.x + (r2.width - 1),
            y2: r2.y + (r2.height - 1)
        };
        if (rect1.x1 > rect2.x2 || rect2.x1 > rect1.x2) {
            return false;
        }

        if (rect1.y1 > rect2.y2 || rect2.y1 > rect1.y2) {
            return false;
        }
        return true;
    }

    return overlaps(roomA, roomB) || overlaps(roomB, roomA);
}

export function isRoomWithinBounds(room, top, left, width, height) {
    return (
        room.x >= left &&
        room.y >= top &&
        room.x + room.width <= left + width &&
        room.y + room.height <= top + height
    );
}

export function distance(pointA, pointB) {
    const a = pointA.x - pointB.x;
    const b = pointA.y - pointB.y;

    const distance = Math.sqrt(a * a + b * b);
    return distance;
}

export function isRoomTooClose(roomA, roomB) {
    return distance(roomA, roomB) < 4;
}
