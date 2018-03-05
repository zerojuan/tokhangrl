import React from "react";
import "phaser";

import Main from "./Scenes/Main";

const style = {
    flexGrow: 2,
    width: "80%",
    height: "540px"
};

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this._game = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.mainScene = null;
    }

    componentDidMount() {
        this.mainScene = new Main(this.props.world);
        const config = {
            width: 1280,
            height: 540,
            type: Phaser.AUTO,
            transparent: true,
            backgroundColor: "rgba(51, 170, 51, 0.5)",
            parent: "game-canvas",
            scene: [this.mainScene]
        };
        this._game = new Phaser.Game(config);
        this.mainScene.onClick(this.handleClick);
        this.mainScene.onHover(this.handleHover);
    }

    handleClick(x, y) {
        this.props.nextTurn();
    }

    handleHover(x, y) {
        // set selected in world
        this.props.hovered(x, y);
    }

    componentWillReceiveProps(nextProps) {
        this.mainScene.updatePath(nextProps.world.path);
        if (nextProps.turn !== this.props.turn) {
            this.mainScene.setTurn(nextProps.turn);
            this.mainScene.updateWorld(nextProps.world);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <div style={style} id="game-canvas" />;
    }
}
