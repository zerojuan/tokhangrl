import React from "react";

export default class PlayerHud extends React.Component {
    render() {
        return (
            <div>
                Player Details:
                <button onClick={this.props.nextTurn}>Update</button>
            </div>
        );
    }
}
