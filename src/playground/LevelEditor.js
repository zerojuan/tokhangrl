import React, { useEffect, useState } from "react";
import "phaser";

import { Layout, Affix } from "antd";
const { Footer, Sider, Content } = Layout;

import ToolControls from "components/ToolControls";
import LevelEditorScene from "../Scenes/LevelEditor";

export default () => {
    const [levelEditorScene, setLevelEditorScene] = useState(null);
    const [activeTool, setActiveTool] = useState(null);

    useEffect(() => {
        const _levelEditorScene = new LevelEditorScene();
        setLevelEditorScene(_levelEditorScene);

        const config = {
            width: 1280,
            height: 540,
            type: Phaser.AUTO,
            transparent: true,
            backgroundColor: "rgba(51, 51, 51, 1)",
            parent: "level-editor-scene",
            scene: [_levelEditorScene]
        };
        const game = new Phaser.Game(config);
    }, []);

    const handleSetActiveTool = tool => () => {
        if (levelEditorScene) {
            if (tool === "none") {
                setActiveTool(null);
                levelEditorScene.setActiveTool(null);
            } else {
                setActiveTool(tool);
                levelEditorScene.setActiveTool(tool);
            }
        }
    };

    return (
        <div>
            <Layout>
                <Layout>
                    <Content>
                        <div id="level-editor-scene" />
                    </Content>
                    <Footer style={{ padding: "6px 6px" }}>
                        <div>
                            <button onClick={handleSetActiveTool("house")}>
                                House
                            </button>
                            <button onClick={handleSetActiveTool("road")}>
                                Road
                            </button>
                            <button onClick={handleSetActiveTool("none")}>
                                Clear
                            </button>
                        </div>
                    </Footer>
                </Layout>
                <Sider width={275} style={{ background: "none" }}>
                    <ToolControls activeTool={activeTool} />
                </Sider>
            </Layout>
        </div>
    );
};
