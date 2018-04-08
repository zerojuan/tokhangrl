import React from "react";

import { Card, Avatar } from "antd";
const { Meta } = Card;

export default class NewsReport extends React.Component {
    render() {
        return (
            <div>
                <Card>
                    <Meta
                        avatar={
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        }
                        title="Dalali Lama"
                        description={"9 mins ago"}
                    />
                    <div>
                        <p>Oh well, Samuel.</p>
                        <p>What is happening</p>
                    </div>
                    <div>
                        <img
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%"
                            }}
                            src="https://fakeimg.pl/350x200/?text=Hello"
                        />
                    </div>
                </Card>
            </div>
        );
    }
}
