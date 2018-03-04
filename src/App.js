import React from "react";

import PlayerHud from "./PlayerHud";
import Game from "./Game";
import StoryLog from "./StoryLog";

import { describeWorld } from "./RL/Description";
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
        if (this.state.world.level[y][x] !== undefined) {
            this.setState(prevState => ({
                currentHovered: describeWorld(prevState.world.level[y][x])
            }));
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
