import React, { useEffect, useState } from 'react';
import '../../index.css';
import { interpolateColor, themeTransientCycle, THEME_GRAY_4B, THEME_GRAY_4H, THEME_GRAY_6B, THEME_GRAY_6H, THEME_GREEN, WHITE } from '../../utils/colors';
import { interpolateTrig } from '../../utils/functions';

import { parseJsonProps, getComponentById, registerComponent } from '../../utils/mapping';

const HobbyButton = ({
    label,
    selectedIndex, // State
    selectIndex,   // Function
    thisIndex,
}) => {
    // Idle loop to update transition states
    const [isHovering, setIsHovering] = useState(false);
    const [hoverParam, setHoverParam] = useState(0);
    const [transient, setTransient] = useState(0);
    const [isSelected, setIsSelected] = useState(false);
    const incrementSize = 0.05;
    useEffect(() => {
        const interval = setInterval(() => {
            setTransient(transient > 0 ? transient - incrementSize : 0);
            setHoverParam(isHovering ? (hoverParam < 1 ? hoverParam + incrementSize : 1) 
                : (hoverParam > 0 ? hoverParam - incrementSize : 0));
        }, 10);
        return () => clearInterval(interval);
      }, [transient, setTransient, isSelected, hoverParam, isHovering]);

    useEffect(() => {
        setIsSelected(thisIndex == selectedIndex);

    }, [selectedIndex]);

    const select = () => {
        setTransient(1);
        selectIndex(thisIndex);
    };

    const renderColor = interpolateColor(isSelected ? THEME_GREEN : THEME_GRAY_6H, isSelected ? THEME_GREEN : THEME_GRAY_6H, hoverParam, interpolateTrig);
    const colorHex = transient > 0 ?
        themeTransientCycle(WHITE, renderColor, 1 - transient, interpolateTrig).getHex()
        :
        renderColor.getHex();

    const renderBorderColor = interpolateColor(isSelected ? THEME_GREEN : THEME_GRAY_6B, isSelected ? THEME_GREEN : THEME_GRAY_6H, hoverParam, interpolateTrig);
    const borderColorHex = isSelected ?
        themeTransientCycle(WHITE, renderBorderColor, 1 - transient, interpolateTrig).getHex()
        :
        renderBorderColor.getHex();
    // Rendering
    return (
        <div className="hobby-button" 
        onClick={() => select()} 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
            color: colorHex,
            border: "1px solid " + borderColorHex,
            backgroundColor: THEME_GRAY_6B.getHex(),
        }}>
            {label}
        </div>
    );
}

export default HobbyButton;