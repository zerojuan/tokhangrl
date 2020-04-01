import React from "react";

import { TOOL_HOUSE, TOOL_ROAD } from "../constants";

import House from "components/tools/House";
import Road from "components/tools/Road";

export default ({ activeTool, onToolParamsChange }) => {
    switch (activeTool) {
        case TOOL_HOUSE:
            return <House onChange={onToolParamsChange}></House>;

        case TOOL_ROAD:
            return <Road onChange={onToolParamsChange}></Road>;
        default:
            return "";
    }
};
