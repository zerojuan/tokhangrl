import React from "react";
import { Card, Avatar } from "antd";
const { Meta } = Card;

export default class PersonInfo extends React.Component {
    render() {
        const { person } = this.props;
        return (
            <Card bordered={false}>
                <Meta
                    avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title={person.name}
                    description={`${person.age}, ${person.occupation.name}`}
                />
                {person.name}
                <br />
                {person.info.map((info, i) => {
                    return <span key={i}>{info}</span>;
                })}
            </Card>
        );
    }
}
