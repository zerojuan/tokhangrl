import React, { useState, useEffect } from "react";

import { Input } from "antd";

export default ({ onChange }) => {
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(2);
    const [description, setDescription] = useState("");

    useEffect(() => {
        onChange({
            width,
            height,
            description
        });
    }, [width, height, description]);

    const handleWidth = e => {
        setWidth(e.target.value);
    };

    const handleHeight = e => {
        setHeight(e.target.value);
    };

    const handleDescription = e => {
        setDescription(e.target.value);
    };

    return (
        <div>
            <h1>House</h1>
            <div>
                <Input
                    value={width}
                    addonBefore="Width"
                    onChange={handleWidth}
                />
                <Input
                    value={height}
                    addonBefore="Height"
                    onChange={handleHeight}
                />
                <Input
                    value={description}
                    addonBefore="Description"
                    onChange={handleDescription}
                />
            </div>
        </div>
    );
};
