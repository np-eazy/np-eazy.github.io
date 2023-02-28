import React, { useState, useEffect } from 'react';

import { default as FoldGraphics } from'./fold-graphics/fold-graphics';
import { default as System } from './fold-graphics/system';

const FoldCanvas = ({
    height,
    width,
}) => {
    
    const [system, setSystem] = useState(new System({}));
    const [canvasTimer, setCanvasTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSystem(system.update(1));
            setCanvasTimer(canvasTimer + 1);
        }, 20);
        return () => clearInterval(interval);
      }, [canvasTimer]);

    return (
        <canvas id="fold-graphics" style={{opacity:0.3}} height={height} width={width}>
            <FoldGraphics system={system} />
        </canvas>
    );
};

export default FoldCanvas;