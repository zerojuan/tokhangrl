import React from "react";
import Infinite from "react-infinite";

import ActionSelection from "./components/ActionSelection";

const style = {
    flexGrow: 1
};
export default class StoryLog extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.activeAction) {
        }
    }

    getHistoryElements = () => {
        return;
    };

    render() {
        return (
            <div style={style}>
                {this.props.activeAction ? (
                    <ActionSelection
                        activeAction={this.props.activeAction}
                        onAction={this.props.onAction}
                    />
                ) : (
                    <Infinite
                        elementHeight={20}
                        containerHeight={85}
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
