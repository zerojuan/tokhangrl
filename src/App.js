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
            isMoving: false
        };
        doLOS(
            { row: this.state.world.hero.x, col: this.state.world.hero.y },
            5,
            this.state.world.level
        );
    }

    doMove = () => {
        const isMoving = this.state.world.tick();
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
                    isMoving: isMoving
                };
            });
            setTimeout(this.doMove, 200);
        } else {
            this.setState({
                isMoving: false
            });
        }
    };

    handleNextTurn() {
        if (this.state.isMoving) {
            return;
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
                    tileInfo={this.state.currentHovered}
                    nextTurn={this.handleNextTurn}
                />
                <StoryLog />
            </div>
        );
    }
}
