import Names from "./data/Names";
import People from "./People";
import { MAN, WOMAN, ROWS, COLS } from "../constants";

export function createPeoples({ houses }, level) {
    const people = [];
    let population = 0;
    let richPlaces = 0;
    let poorPlaces = 0;
    // how many houses are there
    console.log("Houses: ", houses.length);
    houses.forEach(house => {
        if (house.area <= 16) {
            population += 2;
            poorPlaces += 1;
        } else if (house.area) {
            population += 3;
            richPlaces += 1;
        }
    });
    console.log("Possible Population:", population);

    // TODO: create families based on households
    // TODO: create couples and children
    for (let i = 0; i < population; i++) {
        // Random gender
        const gender = Math.random() * 10 < 5 ? MAN : WOMAN;
        // Random age
        const age = Math.floor(Math.random() * 40 + 5);

        const randomFirstName =
            gender === MAN
                ? Names.maleNames[
                      Math.floor(Math.random() * Names.maleNames.length)
                  ]
                : Names.femaleNames[
                      Math.floor(Math.random() * Names.femaleNames.length)
                  ];
        const randomLastName =
            Names.lastNames[Math.floor(Math.random() * Names.lastNames.length)];
        const person = new People({
            name: `${randomFirstName} ${randomLastName}`,
            type: gender,
            age: age,
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        });
        people.push(person);
    }

    return people;
}
