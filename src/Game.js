import React, { useEffect, useState } from "react";
import "phaser";

import { Layout, Affix, Row, Col } from "antd";
const { Footer, Sider, Content } = Layout;

import FadeInTransition from "./transitions/FadeInTransition";

import Main from "./Scenes/Main";
import NewsReport from "./components/NewsReport";

const style = {
    // flexGrow: 2,
    // width: "80%",
    // height: "540px"
};

export default ({
    world,
    turn,
    levelCleared,
    nextTurn,
    hovered,
    onNewGame
}) => {
    const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
    const [game, setGame] = useState(null);
    const [mainScene, setMainScene] = useState(null);

    useEffect(() => {
        const updateWindowDimensions = () => {
            setGameSize({
                width: `${window.innerWidth}px`,
                height: `${window.innerHeight * 0.8}px`
            });
        };

        updateWindowDimensions();

        window.addEventListener("resize", updateWindowDimensions);
        setMainScene(
            new Main(world, () => {
                mainScene.updateWorld(world);
            })
        );
        return () => {
            window.removeEventListener("resize", updateWindowDimensions);
        };
    }, []);

    useEffect(() => {
        if (mainScene) {
            mainScene.updateWorld(world);
            mainScene.onClick(handleClick);
            mainScene.onHover(handleHover);
            const config = {
                width: 1280,
                height: 540,
                type: Phaser.AUTO,
                transparent: true,
                backgroundColor: "rgba(51, 51, 51, 1)",
                parent: "game-canvas",
                scene: [mainScene]
            };
            console.log("Created the game");
            setGame(new Phaser.Game(config));
        }
    }, [mainScene]);

    useEffect(() => {
        if (mainScene) {
            mainScene.setTurn(turn);
            mainScene.updateWorld(world);
        }
    }, [turn, world]);

    useEffect(() => {
        if (mainScene) {
            mainScene.updatePath(world.path);
        }
    }, [world.path]);

    const handleClick = (x, y) => {
        nextTurn({ x, y });
    };

    const handleHover = (x, y) => {
        hovered(x, y);
    };

    const handleDoneGameOver = () => {
        console.log("Done GameOver");
        onNewGame();
    };

    return (
        <div>
            <FadeInTransition in={levelCleared}>
                <Layout key={1}>
                    <Content>
                        <div
                            style={{
                                width: gameSize.width,
                                height: gameSize.height
                            }}
                        >
                            <Row>
                                <Col
                                    xs={{ span: 5, offset: 1 }}
                                    lg={{ span: 6, offset: 2 }}
                                >
                                    <NewsReport />
                                </Col>
                            </Row>
                            <span onClick={handleDoneGameOver}>Done</span>
                        </div>
                    </Content>
                </Layout>
            </FadeInTransition>
            <div style={{ height: gameSize.height }} id="game-canvas" />
        </div>
    );
};
