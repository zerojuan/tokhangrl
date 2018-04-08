import React from "react";
import { Button } from "antd";
import { SHOOT, FREEZE, ARREST, TALK, CANCEL, LEAVE } from "../constants";

export default class ActionSelection extends React.Component {
    onDoAction = action => () => {
        console.log(this.props);
        return this.props.onAction(action);
    };

    getPersonActions = activeAction => {
        return (
            <div>
                {activeAction.getActions(this.props.hero).map((action, i) => {
                    return (
                        <Button
                            key={i}
                            type={action.type}
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

    getThingActions = () => {
        const actions = [];
        if (this.props.activeAction.type === "exit") {
            actions.push({
                type: "primary",
                text: "Leave",
                action: LEAVE
            });
        }
        actions.push({
            type: "default",
            action: CANCEL,
            text: "Cancel"
        });
        return (
            <div>
                {actions.map((action, i) => {
                    return (
                        <Button
                            key={i}
                            type={action.type}
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
        const activeAction = this.props.activeAction;

        // this is a person
        return (
            <div>
                <p>{activeAction.actionDescription}</p>
                {this.getPersonActions(activeAction)}
            </div>
        );
    }
}
