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
import { CANCEL, LEAVE } from "./constants";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleNextTurn = this.handleNextTurn.bind(this);
        this.handleHovered = this.handleHovered.bind(this);
        this.state = {
            turn: 0,
            levelCleared: false,
            world: WorldGenerator.generate(),
            currentHovered: null,
            isMoving: false,
            activeAction: null,
            history: [
                {
                    msg: "It's a new day. In Sta. Ana"
                }
            ]
        };
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
                    activeAction: null,
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
                    activeAction: null,
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
                    activeAction: person
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
                        activeAction: person
                    });
                    return;
                }

                const object = this.state.world.getObject(x, y);
                if (object) {
                    this.setState({
                        activeAction: object
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

                if (prevState.activeAction) {
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
        if (action !== CANCEL) {
            console.log(this.state.activeAction);
            if (this.state.activeAction.value === LEAVE) {
                this.setState({
                    levelCleared: true,
                    activeAction: null
                });
            } else {
                this.state.activeAction.registerAction(action);
                this.doMove();
            }
        } else {
            this.setState({
                activeAction: null
            });
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
                activeAction: null,
                history: [...prevState.history, ...history]
            };
        });
    };

    render() {
        // gameover item
        // const item = this.state.levelCleared ? (
        // ) : null;

        return (
            <div>
                <Layout>
                    <FadeInTransition in={this.state.levelCleared}>
                        <Layout key={1}>
                            <Content>
                                <h1>This is the content</h1>
                            </Content>
                        </Layout>
                    </FadeInTransition>
                    <Layout>
                        <Content>
                            <Game
                                turn={this.state.turn}
                                world={this.state.world}
                                nextTurn={this.handleNextTurn}
                                hovered={this.handleHovered}
                            />
                        </Content>

                        <Footer style={{ padding: "6px 6px" }}>
                            <StoryLog
                                activeAction={this.state.activeAction}
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
                        />
                    </Sider>
                </Layout>
            </div>
        );
    }
}
