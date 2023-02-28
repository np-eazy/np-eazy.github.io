import React, { useState, useEffect } from "react";
import { interpolateTrig } from "../../utils/functions";
import { Color, interpolateColor, THEME_GREEN_HEX, THEME_GRAY_6H, WHITE, themeTransientCycle} from "../../utils/colors";

const DynamicText = ({
    subtitle,
    baseStyle,
}) => {

    const [timer, setTimer] = useState(0);
    const [buffer, setBuffer] = useState(null);
    const [indexedSubtitle, setIndexedSubtitle] = useState(null);
    const baseColor = THEME_GRAY_6H;

    useEffect(() => {
        const interval = setInterval(() => {
            if (buffer == null) {
                var emptyBuffer = [];
                for (var i = 0; i < subtitle.length; i++) {
                    emptyBuffer.push(baseColor);
                }
                var newList = [];
                if (indexedSubtitle == null) {
                    for (var i = 0; i < subtitle.length; i++) {
                        newList.push([subtitle.length - 1 - i, subtitle[i]]);
                    }
                }
                setIndexedSubtitle(newList);
                setBuffer(emptyBuffer);
            } else {

                if (timer % 2000 < 100) {
                    var t = timer / 100.0;
                    setBuffer([
                        ...buffer.slice(1),
                        themeTransientCycle(baseColor, baseColor, t, interpolateTrig)
                    ]);
                } else {
                    setBuffer([
                        ...buffer.slice(1),
                        baseColor
                    ]);
                }    
            }
            setTimer(timer + 5);   
        }, 10);
        return () => clearInterval(interval);
      }, [timer]);

    return (
        <div 
        onMouseOver={() => {setTimer(0)}}
        style={baseStyle}>
            {buffer == null || indexedSubtitle == null ? "" : 
                indexedSubtitle.map(
                    ([key, character]) => {
                        return(
                        <font key={key}
                        style={{color:interpolateColor(WHITE, buffer[key], 0.5, interpolateTrig).getHex()}}>
                            {character}
                        </font>);
                    })   
            }
        </div>
    );
};

export default DynamicText;