import React from "react";

import House from "components/tools/House";
import Road from "components/tools/Road";

export default ({ activeTool }) => {
    switch (activeTool) {
        case "house":
            return <House></House>;

        case "road":
            return <Road></Road>;
        default:
            return "";
    }
};
