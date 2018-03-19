import React from "react";
import "phaser";

import { Layout, Affix } from "antd";
const { Footer, Sider, Content } = Layout;

import FadeInTransition from "./transitions/FadeInTransition";

import Main from "./Scenes/Main";
import NewsReport from "./components/NewsReport";

const style = {
    // flexGrow: 2,
    // width: "80%",
    // height: "540px"
};

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this._game = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.mainScene = null;
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
        this.mainScene = new Main(this.props.world);
        const config = {
            width: 1280,
            height: 540,
            type: Phaser.AUTO,
            transparent: true,
            backgroundColor: "rgba(51, 51, 51, 1)",
            parent: "game-canvas",
            scene: [this.mainScene]
        };
        this._game = new Phaser.Game(config);
        this.mainScene.onClick(this.handleClick);
        this.mainScene.onHover(this.handleHover);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            width: `${window.innerWidth}px`,
            height: `${window.innerHeight * 0.8}px`
        });
    }

    handleClick(x, y) {
        this.props.nextTurn({
            x: x,
            y: y
        });
    }

    handleHover(x, y) {
        // set selected in world
        this.props.hovered(x, y);
    }

    componentWillReceiveProps(nextProps) {
        this.mainScene.updatePath(nextProps.world.path);
        if (nextProps.turn !== this.props.turn) {
            this.mainScene.setTurn(nextProps.turn);
            this.mainScene.updateWorld(nextProps.world);
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        // TODO: show game over ui here
        return (
            <div>
                <FadeInTransition in={this.props.levelCleared}>
                    <Layout key={1}>
                        <Content>
                            <div
                                style={{
                                    width: this.state.width,
                                    height: this.state.height
                                }}
                            >
                                <NewsReport />
                                This is the content
                                <span onClick={this.handleDoneGameOver}>
                                    Done
                                </span>
                            </div>
                        </Content>
                    </Layout>
                </FadeInTransition>
                <div style={{ height: this.state.height }} id="game-canvas" />
            </div>
        );
    }
}
