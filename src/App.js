import React from "react";

import { Layout, Affix } from "antd";
const { Footer, Sider, Content } = Layout;

import FadeInTransition from "./transitions/FadeInTransition";

import PlayerHud from "./PlayerHud";
import Game from "./Game";
import StoryLog from "./StoryLog";

import { describeWorld } from "./RL/Description";
import { findPath } from "./RL/Pathfinder";
import { doLOS, calculateLine } from "./RL/LineOfSight";
import WorldGenerator from "./RL/WorldGenerator";
import { CANCEL, LEAVE, STATE_LEVEL_ACTION } from "./constants";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleNextTurn = this.handleNextTurn.bind(this);
        this.handleHovered = this.handleHovered.bind(this);
        this.state = this.createNewGameState();
        doLOS(
            { row: this.state.world.hero.x, col: this.state.world.hero.y },
            5,
            this.state.world.level
        );
    }

    doMove = () => {
        const { isMoving, history } = this.state.world.tick();
        if (isMoving) {
            this.setState(prevState => {
                doLOS(
                    {
                        row: prevState.world.hero.x,
                        col: prevState.world.hero.y
                    },
                    5,
                    prevState.world.level
                );
                return {
                    turn: prevState.turn + 1,
                    isMoving: isMoving,
                    activeSelection: null,
                    history: [...prevState.history, ...history]
                };
            });
            setTimeout(this.doMove, 200);
        } else {
            this.setState(prevState => {
                prevState.world.path = [];
                return {
                    turn: prevState.turn + 1,
                    isMoving: false,
                    activeSelection: null,
                    history: [...prevState.history, ...history]
                };
            });
        }
    };

    handleNextTurn({ x, y }) {
        if (this.state.isMoving) {
            this.state.world.path = [];
            return;
        }

        // check if clicked a person
        if (this.state.world.hero.gunAimed) {
            // if clicked on someone
            const person = this.state.world.getPerson(x, y);
            if (person) {
                this.setState({
                    activeSelection: person
                });
                return;
            }
        } else {
            // if clicked on someone right next to me
            if (this.state.world.clickedAdjacent(x, y)) {
                const person = this.state.world.getPerson(x, y);
                if (person) {
                    // show actions panel
                    this.setState({
                        activeSelection: person
                    });
                    return;
                }

                const object = this.state.world.getObject(x, y);
                if (object) {
                    this.setState({
                        activeSelection: object
                    });
                    return;
                }
            }
        }

        this.state.world.startLongMove();
        this.doMove();
    }

    handleHovered(x, y) {
        // check if this is part of the world
        if (this.state.world.level[x][y] !== undefined) {
            this.setState(prevState => {
                if (prevState.isMoving) {
                    return;
                }

                if (prevState.activeSelection) {
                    return;
                }

                let path;
                const tile = prevState.world.level[x][y];
                if (prevState.world.hero.gunAimed) {
                    // aiming mode (only show paths within radius)

                    if (tile.visibility === 1) {
                        path = calculateLine(
                            {
                                row: prevState.world.hero.y,
                                col: prevState.world.hero.x
                            },
                            {
                                row: y,
                                col: x
                            }
                        );
                    }
                } else {
                    if (tile.visibility >= 0.5) {
                        path = findPath(
                            {
                                row: prevState.world.hero.y,
                                col: prevState.world.hero.x
                            },
                            {
                                row: y,
                                col: x
                            },
                            prevState.world.level
                        );
                    }
                }
                prevState.world.path = path;
                return {
                    currentHovered: describeWorld(prevState.world, x, y),
                    world: prevState.world
                };
            });
        }
    }

    handleAction = action => {
        console.log("Action:", action);
        if (action.actionType === STATE_LEVEL_ACTION) {
            action.doAction(this);
            return;
        } else {
            this.state.world.hero.activeAction = action;
            action.actor = this.state.world.hero;
            this.state.activeSelection.registerAction(action);
            this.doMove();
        }
    };

    handleGunToggled = () => {
        this.state.world.path = [];
        this.state.world.hero.gunAimed = !this.state.world.hero.gunAimed;
        const { history } = this.state.world.tick();
        this.setState(prevState => {
            return {
                turn: prevState.turn + 1,
                isMoving: false,
                activeSelection: null,
                history: [...prevState.history, ...history]
            };
        });
    };

    handleDoneGameOver = () => {
        this.setState({
            levelCleared: false
        });
    };

    handleNewGame = () => {
        this.setState(prevState => {
            const newState = this.createNewGameState();
            doLOS(
                {
                    row: newState.world.hero.x,
                    col: newState.world.hero.y
                },
                5,
                newState.world.level
            );

            return newState;
        });
    };

    createNewGameState = () => {
        const world = WorldGenerator.generate();
        return {
            turn: 0,
            levelCleared: false,
            world: world,
            currentHovered: null,
            isMoving: false,
            activeSelection: null,
            history: [
                {
                    msg: "It's a new day. In Sta. Ana"
                }
            ]
        };
    };

    render() {
        return (
            <div>
                <Layout>
                    <Layout>
                        <Content>
                            <Game
                                turn={this.state.turn}
                                world={this.state.world}
                                nextTurn={this.handleNextTurn}
                                hovered={this.handleHovered}
                                levelCleared={this.state.levelCleared}
                                onNewGame={this.handleNewGame}
                            />
                        </Content>

                        <Footer style={{ padding: "6px 6px" }}>
                            <StoryLog
                                activeSelection={this.state.activeSelection}
                                hero={this.state.world.hero}
                                history={this.state.history}
                                onAction={this.handleAction}
                            />
                        </Footer>
                    </Layout>
                    <Sider width={275} style={{ background: "none" }}>
                        <PlayerHud
                            turn={this.state.turn}
                            hero={this.state.world.hero}
                            onGunToggled={this.handleGunToggled}
                            tileInfo={this.state.currentHovered}
                            nextTurn={this.handleNextTurn}
                            target={this.state.world.target}
                        />
                    </Sider>
                </Layout>
            </div>
        );
    }
}
