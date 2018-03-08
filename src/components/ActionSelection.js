import React from "react";

export default class ActionSelection extends React.Component {
    onDoAction = action => () => {
        console.log(this.props);
        return this.props.onAction(action);
    };
    render() {
        const activeAction = this.props.activeAction;

        // this is a person
        if (activeAction.name) {
            return (
                <div>
                    <p>Do what to {activeAction.name}?</p>
                    <p>
                        <button onClick={this.onDoAction("click")}>
                            Action
                        </button>
                    </p>
                </div>
            );
        } else {
            return <div>I don't know what this is</div>;
        }
    }
}
