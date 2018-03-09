import React from "react";
import { Button } from "antd";
import { SHOOT, FREEZE, ARREST, TALK, CANCEL, LEAVE } from "../constants";

export default class ActionSelection extends React.Component {
    onDoAction = action => () => {
        console.log(this.props);
        return this.props.onAction(action);
    };

    getPersonActions = () => {
        const actions = [];
        // if action is to a person
        if (this.props.activeAction.name) {
            if (this.props.hero.gunAimed) {
                actions.push({
                    type: "primary",
                    action: SHOOT,
                    text: "Shoot"
                });
                actions.push({
                    type: "primary",
                    action: FREEZE,
                    text: '"Halt!"'
                });
            } else {
                actions.push({
                    type: "primary",
                    action: ARREST,
                    text: "Arrest"
                });
                actions.push({
                    type: "primary",
                    action: TALK,
                    text: "Talk"
                });
            }
        } else
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
                            onClick={this.onDoAction(action.action)}
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
                            onClick={this.onDoAction(action.action)}
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
        if (activeAction.name) {
            return (
                <div>
                    <p>Do what to {activeAction.name}?</p>
                    {this.getPersonActions()}
                </div>
            );
        } else {
            return <div>{this.getThingActions()}</div>;
        }
    }
}
