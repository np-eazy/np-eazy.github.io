import React, { useEffect, useState } from 'react';
import '../../index.css';

import { THEME_GRAY_6H, THEME_GREEN, WHITE, 
    interpolateColor, themeTransientCycle,  } from '../../utils/colors';
import { interpolateTrig } from '../../utils/functions';

const SideButton = (props) => {

    const [isHovering, setIsHovering] = useState(false);
    const [hoverParam, setHoverParam] = useState(0);
    const [transientParam, setTransientParam] = useState(0);

    const incrementSize = 0.05;
    const tickLength = 10;

    useEffect(() => {
        const interval = setInterval(() => {
            setTransientParam(
                transientParam > 0 ? 
                    transientParam - incrementSize 
                    : 0);
            setHoverParam(
                isHovering ? 
                    (hoverParam < 1 ? 
                        hoverParam + incrementSize 
                        : 1) 
                    : (hoverParam > 0 ? 
                        hoverParam - incrementSize 
                        : 0));
        }, tickLength);
        return () => clearInterval(interval);
    }, [hoverParam, transientParam, isHovering]);

    const navigate = () => {
        window.location.href = props.navigation;
        setTransientParam(1);
    };

    const idleColor = interpolateColor(THEME_GRAY_6H, THEME_GREEN, hoverParam, interpolateTrig);
    const activeColor = WHITE;
    
    return (
        <div className="menu-side-button" 
        onClick={() => navigate()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
            <div style={{
                    color: (
                        transientParam > 0 ?
                            themeTransientCycle(idleColor, activeColor, transientParam, interpolateTrig).getHex()
                            : idleColor.getHex())
                }}>
                {props.children}
            </div>
        </div>
    );
}

export default SideButton;