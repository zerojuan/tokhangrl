import React from "react";

import PlayerHud from "./PlayerHud";
import Game from "./Game";
import StoryLog from "./StoryLog";

import { describeWorld } from "./RL/Description";
import { findPath } from "./RL/Pathfinder";
import WorldGenerator from "./RL/WorldGenerator";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleNextTurn = this.handleNextTurn.bind(this);
        this.handleHovered = this.handleHovered.bind(this);
        this.state = {
            turn: 0,
            world: WorldGenerator.generate(),
            currentHovered: null
        };
    }

    handleNextTurn() {
        this.setState(prevState => {
            prevState.world.tick();
            return {
                turn: prevState.turn + 1
            };
        });
    }

    handleHovered(x, y) {
        // check if this is part of the world
        if (this.state.world.level[x][y] !== undefined) {
            this.setState(prevState => {
                const path = findPath(
                    {
                        row: 5,
                        col: 5
                    },
                    {
                        row: y,
                        col: x
                    },
                    prevState.world.level
                );
                prevState.world.path = path;
                return {
                    currentHovered: describeWorld(prevState.world.level[x][y])
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
