import React, { useEffect, useState } from "react";
import "phaser";

import { Layout, Affix } from "antd";
const { Footer, Sider, Content } = Layout;

import { TOOL_HOUSE, TOOL_ROAD } from "../constants";

import ToolControls from "components/ToolControls";
import LevelEditorSummary from "components/LevelEditorSummary";
import LevelEditorScene from "../Scenes/LevelEditor";

export default () => {
    const [levelEditorScene, setLevelEditorScene] = useState(null);
    const [activeTool, setActiveTool] = useState(null);
    const [levelData, setLevelData] = useState(null);

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

    useEffect(() => {
        if (levelEditorScene) {
            levelEditorScene.parentClickHandler = handleClick;
            levelEditorScene.parentHoverHandler = handleHover;

            return () => {
                levelEditorScene.parentClickHandler = null;
                levelEditorScene.parentHoverHandler = null;
            };
        }
    }, [levelEditorScene]);

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

    const handleActiveToolParamsChange = params => {
        if (levelEditorScene) {
            levelEditorScene.setActiveToolParams(params);
        }
    };

    const handleClick = (x, y) => {
        setLevelData(levelEditorScene.levelData);
        if (activeTool === "none" || activeTool === null) {
            return;
        }
    };

    const handleHover = (x, y) => {};

    return (
        <div>
            <Layout>
                <Layout>
                    <Content>
                        <div id="level-editor-scene" />
                    </Content>
                    <Footer style={{ padding: "6px 6px" }}>
                        <div>
                            <button onClick={handleSetActiveTool(TOOL_HOUSE)}>
                                House
                            </button>
                            <button onClick={handleSetActiveTool(TOOL_ROAD)}>
                                Road
                            </button>
                            <button onClick={handleSetActiveTool("none")}>
                                Clear
                            </button>
                        </div>
                    </Footer>
                </Layout>
                <Sider width={275} style={{ background: "none" }}>
                    <ToolControls
                        activeTool={activeTool}
                        onToolParamsChange={handleActiveToolParamsChange}
                    />
                    <LevelEditorSummary
                        levelData={levelData ? levelData : null}
                    />
                </Sider>
            </Layout>
        </div>
    );
};
