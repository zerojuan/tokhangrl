import React from "react";

export default ({ levelData }) => {
    return (
        <div>
            <h1>Summary</h1>
            <div>
                {levelData ? (
                    <ul>
                        {levelData.houses.map(house => {
                            return (
                                <div>
                                    <div>ID: {house.id}</div>
                                </div>
                            );
                        })}
                    </ul>
                ) : (
                    <div>World is empty</div>
                )}
            </div>
        </div>
    );
};
