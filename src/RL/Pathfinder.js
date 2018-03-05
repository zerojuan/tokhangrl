const diagonalCost = 14;

function sortByScore(a, b) {
    if (a.f > b.f) {
        return -1;
    } else if (a.f == b.f) {
        return 0;
    } else if (a.f < b.f) {
        return 1;
    }

    return 0;
}

function getMovementCost(current, neighbor) {
    var diagonal =
        neighbor.pos.row != current.pos.row &&
        neighbor.pos.col != current.pos.col;
    return diagonal ? diagonalCost : 10;
}

function getH(current, start, end) {
    const a = current.pos;
    const b = end;

    //DotTieBreaker
    const dx1 = a.col - b.col;
    const dy1 = a.row - b.row;
    const dx2 = start.col - b.col;
    const dy2 = start.row - b.row;
    const cross = Math.abs(dx1 * dy2 - dx2 * dy1);

    const straight = Math.abs(
        Math.abs(a.col - b.col) - Math.abs(a.row - b.row)
    );
    const diagonal =
        Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row)) - straight;
    return straight + diagonalCost * diagonal + cross * 0.001;
}

function getNeighbors(node, map) {
    const n = [];
    const dir = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1]
    ];
    for (let i = 0; i < 8; i++) {
        if (
            node.col + dir[i][0] < 0 ||
            node.col + dir[i][0] > map[0].length - 1
        )
            continue;
        if (node.row + dir[i][1] < 0 || node.row + dir[i][1] > map.length - 1)
            continue;

        //console.log("(", node.col, node.row, ")(", node.col+dir[i][0], node.row+dir[i][1], ")");
        const p = map[node.row + dir[i][1]][node.col + dir[i][0]];

        if (p.solid) continue;

        n.push({
            pos: {
                row: node.row + dir[i][1],
                col: node.col + dir[i][0]
            }
        });
    }
    return n;
}

function getOldValue(node, array) {
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (item.pos.col == node.pos.col && item.pos.row == node.pos.row) {
            return item;
        }
    }

    return false;
}

function removeValue(node, array) {
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (item.pos.row == node.pos.row && item.pos.col == node.pos.col) {
            array.splice(i, 1);
            return;
        }
    }
}

export function findPath(start, end, map) {
    var CLOSED = [],
        OPEN = [],
        current;
    OPEN.push({
        pos: start,
        f: 0,
        g: 0,
        h: 0,
        parent: null
    });

    var pathFound = false;
    while (OPEN.length > 0) {
        current = OPEN.pop();
        if (current.pos.row == end.row && current.pos.col == end.col) {
            //PATH FOUND!
            pathFound = true;
            break;
        }
        CLOSED.push(current);
        var neighbors = getNeighbors(current.pos, map);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            // cost = g(current) + movementcost(current, neighbor)
            var cost = current.g + getMovementCost(current, neighbor);
            var neighborFromOpen = getOldValue(neighbor, OPEN);
            var neighborFromClosed = getOldValue(neighbor, CLOSED);
            // if neighbor in OPEN and cost less than g(neighbor):
            if (neighborFromOpen && neighborFromOpen.g > cost) {
                // remove neighbor from OPEN, because new path is better
                removeValue(neighborFromOpen, OPEN);
                neighborFromOpen = null;
            }
            // if neighbor in CLOSED and cost less than g(neighbor): **
            if (neighborFromClosed && neighborFromClosed.g > cost) {
                // remove neighbor from CLOSED
                removeValue(neighborFromClosed, CLOSED);
                neighborFromClosed = null;
            }
            // if neighbor not in OPEN and neighbor not in CLOSED:
            if (!neighborFromClosed && !neighborFromOpen) {
                // set g(neighbor) to cost
                neighbor.g = cost;
                // add neighbor to OPEN
                // set priority queue rank to g(neighbor) + h(neighbor)
                neighbor.h = getH(neighbor, start, end);
                neighbor.f = neighbor.g + neighbor.h;
                // set neighbor's parent to current
                neighbor.parent = current;
                OPEN.push(neighbor);
                OPEN.sort(sortByScore);
            }
        }
    }

    //		reconstruct reverse path from goal to start
    if (pathFound) {
        console.log("Path found!");
        var path = [];
        path.push(current.pos);
        while (current.parent) {
            var current = current.parent;
            path.push(current.pos);
        }
        path.pop();
        path.reverse();

        return path;
    } else {
        console.log("Path Not Found!");
        return null;
    }
}
