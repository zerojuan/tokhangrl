import React from "react";

import PlayerHud from "./PlayerHud";
import Game from "./Game";
import StoryLog from "./StoryLog";

import { describeWorld } from "./RL/Description";
import { findPath } from "./RL/Pathfinder";
import { doLOS } from "./RL/LineOfSight";
import WorldGenerator from "./RL/WorldGenerator";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleNextTurn = this.handleNextTurn.bind(this);
        this.handleHovered = this.handleHovered.bind(this);
        this.state = {
            turn: 0,
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

            // if door?
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

                const path = findPath(
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
                prevState.world.path = path;
                return {
                    currentHovered: describeWorld(prevState.world, x, y)
                };
            });
        }
    }

    handleAction = action => {
        // this.setState(prevState => {
        //     // if ( action === ACTIVATE)
        //     prevState.activeAction.registerAction(action);
        //     return {
        //         activeAction: null
        //     };
        // });
        this.state.activeAction.registerAction(action);
        this.doMove();
    };

    render() {
        return (
            <div className="container">
                <Game
                    turn={this.state.turn}
                    world={this.state.world}
                    nextTurn={this.handleNextTurn}
                    hovered={this.handleHovered}
                />
                <PlayerHud
                    turn={this.state.turn}
                    hero={this.state.world.hero}
                    tileInfo={this.state.currentHovered}
                    nextTurn={this.handleNextTurn}
                />
                <StoryLog
                    activeAction={this.state.activeAction}
                    history={this.state.history}
                    onAction={this.handleAction}
                />
            </div>
        );
    }
}
