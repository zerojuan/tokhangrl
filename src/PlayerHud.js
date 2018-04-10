import React from "react";
import { Card, Icon, Avatar, Divider } from "antd";
const { Meta } = Card;

import PersonInfo from "./components/PersonInfo";
import HeroInfo from "./components/HeroInfo";

const style = {
    // flexGrow: 1,
    // height: "80%"
};
export default class PlayerHud extends React.Component {
    render() {
        return (
            <div style={style}>
                <HeroInfo
                    person={this.props.hero}
                    onGunToggled={this.props.onGunToggled}
                    tile={this.props.tileInfo ? this.props.tileInfo.tile : null}
                />
                <Divider>Target</Divider>
                <PersonInfo person={this.props.target} />

                {this.props.tileInfo ? (
                    <div>
                        {this.props.tileInfo.person ? (
                            <div>
                                <Divider>Person</Divider>
                                <PersonInfo
                                    person={this.props.tileInfo.person}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}
