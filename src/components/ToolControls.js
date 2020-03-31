import React from "react";

import House from "components/tools/House";
import Road from "components/tools/Road";

export default ({ activeTool, onToolParamsChange }) => {
    switch (activeTool) {
        case "house":
            return <House onChange={onToolParamsChange}></House>;

        case "road":
            return <Road onChange={onToolParamsChange}></Road>;
        default:
            return "";
    }
};
