import React from "react";
import { Button } from "antd";
import { SHOOT, FREEZE, ARREST, TALK, CANCEL, LEAVE } from "../constants";

export default class ActionSelection extends React.Component {
    onDoAction = action => () => {
        return this.props.onAction(action);
    };

    getActions = activeSelection => {
        return (
            <div>
                {activeSelection
                    .getActions(this.props.hero)
                    .map((action, i) => {
                        return (
                            <Button
                                key={i}
                                type={action.uiType}
                                size="small"
                                style={{
                                    marginRight: "5px"
                                }}
                                onClick={this.onDoAction(action)}
                            >
                                {action.text}
                            </Button>
                        );
                    })}
            </div>
        );
    };

    render() {
        const activeSelection = this.props.activeSelection;

        // this is a person
        return (
            <div>
                <p>{activeSelection.actionDescription}</p>
                {this.getActions(activeSelection)}
            </div>
        );
    }
}
