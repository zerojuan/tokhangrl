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
                {this.props.tileInfo ? (
                    <div>
                        <p>What:{this.props.tileInfo.tile.description}</p>
                        <p>
                            Who:{this.props.tileInfo.person
                                ? this.props.tileInfo.person.name
                                : "None"}
                        </p>
                    </div>
                ) : (
                    <p>??</p>
                )}
            </div>
        );
    }
}
