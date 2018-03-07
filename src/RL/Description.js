export function describeWorld(world, x, y) {
    const tile = world.level[x][y];

    // search the characters if in the same tile
    const person = world.people.find(person => {
        return person.position.x === x && person.position.y === y;
    });

    return {
        tile,
        person
    };
}
