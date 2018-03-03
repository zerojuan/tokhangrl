import React from "react";

import PlayerHud from "./PlayerHud";
import Game from "./Game";
import StoryLog from "./StoryLog";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleNextTurn = this.handleNextTurn.bind(this);
        this.state = {
            turn: 0
        };
    }

    handleNextTurn() {
        this.setState(prevState => ({
            turn: prevState.turn + 1
        }));
    }

    render() {
        return (
            <div>
                <PlayerHud
                    turn={this.state.turn}
                    nextTurn={this.handleNextTurn}
                />
                <StoryLog />
                <Game turn={this.state.turn} nextTurn={this.handleNextTurn} />
            </div>
        );
    }
}
