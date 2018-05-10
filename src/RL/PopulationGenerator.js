import { randomMaleName, randomLastName, randomFemaleName } from "./data/Names";
import People from "./People";
import { MAN, WOMAN, ROWS, COLS } from "../constants";

function createFamily(house) {
    // get random family name
    const familyName = randomLastName();
    const fatherName = randomMaleName();
    const motherName = randomFemaleName();

    const fatherAge = Math.floor(Math.random() * 40 + 20);
    const motherAge = Math.floor(Math.random() * 40 + 20);
    // get random female name
    const father = new People({
        name: `${fatherName} ${familyName}`,
        type: MAN,
        age: fatherAge,
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
    });
    father.house = house;

    const mother = new People({
        name: `${motherName} ${familyName}`,
        type: WOMAN,
        age: motherAge,
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
    });
    mother.house = house;

    // check how many possible children

    return [mother, father];
}

export function createPeoples({ houses }, level) {
    const people = [];
    let family = 0;
    let richPlaces = 0;
    let poorPlaces = 0;
    // how many houses are there
    console.log("Houses: ", houses.length);
    const families = houses.map(house => {
        if (house.area <= 16) {
            poorPlaces += 1;
        } else if (house.area) {
            richPlaces += 1;
        }
        family += 1;
        return createFamily(house);
    });
    console.log("Possible Population:", family);

    return families.reduce((arr, val) => arr.concat(val), []);
}

export function setInitialPositions({ houses, people }, level) {
    // set the peoples initial location
    people.forEach(person => {
        person.x = person.house.x;
        person.y = person.house.y;
    });

    return people;
}
