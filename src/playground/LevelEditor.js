import React, { useEffect } from "react";
import "phaser";

import LevelEditorScene from "../Scenes/LevelEditor";

export default () => {
    useEffect(() => {
        const levelEditorScene = new LevelEditorScene();

        const config = {
            width: 1280,
            height: 540,
            type: Phaser.AUTO,
            transparent: true,
            backgroundColor: "rgba(51, 51, 51, 1)",
            parent: "level-editor-scene",
            scene: [levelEditorScene]
        };
        const game = new Phaser.Game(config);
    }, []);

    return (
        <div>
            <div id="level-editor-scene" />
        </div>
    );
};
