import React from "react";
import Infinite from "react-infinite";

import ActionSelection from "./components/ActionSelection";

const style = {
    // padding: "6px 6px"
};
export default class StoryLog extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.activeSelection) {
        }
    }

    getHistoryElements = () => {
        return;
    };

    render() {
        return (
            <div style={style}>
                {this.props.activeSelection ? (
                    <ActionSelection
                        hero={this.props.hero}
                        activeSelection={this.props.activeSelection}
                        onAction={this.props.onAction}
                    />
                ) : (
                    <Infinite
                        elementHeight={20}
                        containerHeight={100}
                        displayBottomUpwards
                    >
                        {this.props.history.map((history, i) => {
                            return <div key={i}>{history.msg}</div>;
                        })}
                    </Infinite>
                )}
            </div>
        );
    }
}
