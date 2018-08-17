import React from "react";
import "phaser";

import FlowFieldScene from "../Scenes/FlowField";

export default class FlowField extends React.Component {
    componentDidMount() {
        this.flowField = new FlowFieldScene();
        const config = {
            width: 1280,
            height: 540,
            type: Phaser.AUTO,
            transparent: true,
            backgroundColor: "rgba(51, 51, 51, 1)",
            parent: "flowfield-demo",
            scene: [this.flowField]
        };
        this._game = new Phaser.Game(config);
    }

    render() {
        return (
            <div>
                <span>Flowfield Demo</span>
                <div id="flowfield-demo" />
            </div>
        );
    }
}
