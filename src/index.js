import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import "antd/dist/antd.css";

import App from "./App";
import FlowField from "./playground/FlowField";

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/flowfield" component={FlowField} />
        </div>
    </BrowserRouter>,
    document.getElementById("game")
);
