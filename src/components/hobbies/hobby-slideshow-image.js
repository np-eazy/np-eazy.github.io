import React, { useState, useEffect } from "react";
import { THEME_GRAY_6B } from "../../utils/colors";

const HobbySlideshowImage = ({
    imageLink,
    renderParam,
    zIndex,
}) => {
    
const [opacity, setOpacity] = useState(0.9);

    var dimension = Math.max(0, 500 * (1 - renderParam * renderParam / 4));
    var yPosition = 400 * Math.sin(renderParam * Math.PI / 4);

    return (
        <div style={{
            height: dimension,
            width: dimension,
            zIndex: zIndex,
            bottom: yPosition + 150,
            backgroundColor: THEME_GRAY_6B.getHex(),

            position: "relative",
            margin: "auto",
            borderRadius: "20px",
            overflow: "hidden",
            filter: dimension > 100 ? "drop-shadow(10px 10px 10px #202026)" : "",
            opacity: dimension > 100 ? 1 : 0,
        }}>
            <img src={imageLink} 
            onMouseEnter={() => {setOpacity(1);}}
            onMouseLeave={() => {setOpacity(0.9);}}
            style={{
                height: dimension,
                width: dimension,
                aspectRatio: "1 / 1",
                opacity: opacity * (1 - renderParam * renderParam / 2),
            }}></img>
        </div>
    );
};

export default HobbySlideshowImage;