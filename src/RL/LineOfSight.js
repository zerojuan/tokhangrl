const fogIntensity = 0.5;

export function calculateLine(start, end) {
    const points = [];
    let x0 = start.col;
    let y0 = start.row;
    let x1 = end.col;
    let y1 = end.row;

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        points.push({
            row: y0,
            col: x0
        });

        if (x0 == x1 && y0 == y1) break;

        const e2 = err * 2;
        if (e2 > -dx) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }

    return points;
}

function canSee(start, end, visionRadius, map) {
    const wx = end.col;
    const wy = end.row;

    const x = start.col;
    const y = start.row;

    if ((x - wx) * (x - wx) + (y - wy) * (y - wy) > visionRadius * visionRadius)
        return false;

    const line = calculateLine(start, end);
    for (let i = 0; i < line.length; i++) {
        let point = line[i];
        if (
            map[point.row][point.col].ground ||
            (point.row == wy && point.col == wx)
        )
            continue;

        return false;
    }

    return true;
}

export function doLOS(playerPos, visionRadius, map) {
    if (!playerPos) {
        return;
    }
    if (!map) {
        return;
    }
    //grayout everything
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j].visibility === 1) {
                map[i][j].visibility = fogIntensity;
            }

            const point = {
                row: i,
                col: j
            };

            if (canSee(playerPos, point, visionRadius, map)) {
                map[i][j].visibility = 1;
            }
        }
    }
}
