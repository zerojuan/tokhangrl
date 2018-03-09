import React from "react";
import { Card, Switch, Avatar } from "antd";
const { Meta } = Card;

class GunInfo extends React.Component {
    render() {
        return (
            <div>
                <span>Gun ({this.props.person.ammo} bullets)</span>
                <Switch
                    checkedChildren="Aiming"
                    unCheckedChildren="Holstered"
                    checked={this.props.person.gunAimed}
                    onChange={this.props.onGunToggled}
                />
            </div>
        );
    }
}

export default class HeroInfo extends React.Component {
    render() {
        const { person, tile } = this.props;

        return (
            <div>
                <Card bordered={false}>
                    <Meta
                        avatar={
                            <Avatar
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                size="large"
                            />
                        }
                        title={person.name}
                        description={`${person.kills} kills, ${
                            person.missions
                        } missions`}
                    />
                    <GunInfo
                        person={person}
                        onGunToggled={this.props.onGunToggled}
                    />
                </Card>
                <div>
                    {tile ? (
                        <span>
                            {tile.description}, ({tile.x},{tile.y})
                        </span>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        );
    }
}
