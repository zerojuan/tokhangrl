import React from "react";
import "phaser";

import Main from "./Scenes/Main";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this._game = null;
    }

    componentDidMount() {
        const config = {
            width: 800,
            height: 600,
            type: Phaser.AUTO,
            parent: "game-canvas",
            scene: {
                create: Main.create,
                update: Main.update
            }
        };
        this._game = new Phaser.Game(config);
    }

    componentWillReceiveProps(nextProps) {
        Main.setTurn(nextProps.turn);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <div id="game-canvas" />;
    }
}
