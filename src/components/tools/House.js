import React, { useState, useEffect } from "react";

import { Input } from "antd";

export default ({ width = 3, height = 3, description = "", id, onChange }) => {
    const [_width, setWidth] = useState(width);
    const [_height, setHeight] = useState(height);
    const [_description, setDescription] = useState(description);

    useEffect(() => {
        onChange({
            width: _width,
            height: _height,
            description: _description
        });
    }, [_width, _height, _description]);

    const handleWidth = e => {
        setWidth(parseInt(e.target.value));
    };

    const handleHeight = e => {
        setHeight(parseInt(e.target.value));
    };

    const handleDescription = e => {
        setDescription(e.target.value);
    };

    return (
        <div>
            <h1>House</h1>
            {id ? <div>ID: {id}</div> : ""}
            <div>
                <Input
                    value={_width}
                    addonBefore="Width"
                    onChange={handleWidth}
                />
                <Input
                    value={_height}
                    addonBefore="Height"
                    onChange={handleHeight}
                />
                <Input
                    value={_description}
                    addonBefore="Description"
                    onChange={handleDescription}
                />
            </div>
        </div>
    );
};
