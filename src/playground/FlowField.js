import React, { useEffect } from "react";
import "phaser";

import FlowFieldScene from "../Scenes/FlowField";

export default () => {
    useEffect(() => {
        const flowField = new FlowFieldScene();
        const config = {
            width: 1280,
            height: 540,
            type: Phaser.AUTO,
            transparent: true,
            backgroundColor: "rgba(51, 51, 51, 1)",
            parent: "flowfield-demo",
            scene: [flowField]
        };
        const game = new Phaser.Game(config);
    }, []);

    return (
        <div>
            <span>Flowfield Demo</span>
            <div id="flowfield-demo" />
        </div>
    );
};
