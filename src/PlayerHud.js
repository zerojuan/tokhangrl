import React from "react";

const style = {
    flexGrow: 1,
    height: "80%"
};
export default class PlayerHud extends React.Component {
    render() {
        return (
            <div style={style}>
                Player Details:
                <button onClick={this.props.nextTurn}>Update</button>
                <p>What:{this.props.tileInfo}</p>
            </div>
        );
    }
}
