import React from "react";
import Infinite from "react-infinite";
import Scrollbars from "react-custom-scrollbars";

import ActionSelection from "./components/ActionSelection";

const style = {
    // padding: "6px 6px"
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
                        hero={this.props.hero}
                        activeAction={this.props.activeAction}
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
