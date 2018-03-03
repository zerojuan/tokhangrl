let text;
let turn = 0;

let mouseX = 0;
let mouseY = 0;

function create() {
    const welcomeMessage = "Welcome to Phaser";
    text = this.add
        .text(120, 50, welcomeMessage, {
            font: "bold 19px Arial",
            fill: "#fff"
        })
        .setOrigin(0.5, 0.5);

    console.log(this.input);
    this.input.on("pointermove", function(event) {
        mouseX = event.x;
        mouseY = event.y;
    });
}

function update() {
    text.setText(`The turn: ${turn}, ${mouseX}, ${mouseY}`);
}

function setTurn() {
    turn += 1;
}

export default {
    create,
    update,
    setTurn
};
