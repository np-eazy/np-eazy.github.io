import React, { useState, useEffect } from 'react';
import { interpolateTrig } from '../../utils/functions';

import {default as HobbySlideshowImage} from './hobby-slideshow-image';
const HobbySlideshow = ({
    imageLinks,
    renderParams,
}) => {
    // Idle loop to update transition states

    const [slideshowIndex, setSlideshowIndex] = useState(0);
    const [renderTimer, setRenderTimer] = useState(0);
    const [renderOffset, setRenderOffset] = useState(0);
    const [scrollMode, setScrollMode] = useState(0);
    const scrollIncrement = 0.025;
    

    const indexUp = () => {
        if (imageLinks != undefined) {
            setSlideshowIndex(wraparound(slideshowIndex - 1, Array.from(imageLinks.imageLinks).length));
            setScrollMode(1);
            setRenderTimer(-1);
        }
    }
    const indexDown = () => {
        if (imageLinks != undefined) {
            setSlideshowIndex(wraparound(slideshowIndex + 1, Array.from(imageLinks.imageLinks).length));
            setScrollMode(-1);
            setRenderTimer(+1);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (imageLinks != undefined) {
                if (scrollMode == 1) {
                    setRenderTimer(renderTimer >= 0 ? 0 : renderTimer + scrollIncrement);
                    setRenderOffset(-1 * interpolateTrig(0, 1, renderTimer));


                } else if (scrollMode == -1) {
                    setRenderTimer(renderTimer <= 0 ? 0 : renderTimer - scrollIncrement);
                    setRenderOffset(interpolateTrig(0, 1, renderTimer));

                } else {
                    setRenderTimer(0);
                }
            }
        }, 10);
        return () => clearInterval(interval);
    });

    const wraparound = (num, mod) => {
        if (num < 0) {
            return (num - 1 + mod) % mod + 1;
        } else {
            return num % mod;
        }
    }

    if (imageLinks != undefined) {
        const images = Array.from(imageLinks.imageLinks).length;

        var prevPrevImage = imageLinks.imageLinks[wraparound(slideshowIndex - 2, images)];
        var prevImage = imageLinks.imageLinks[wraparound(slideshowIndex - 1, images)];
        var currImage = imageLinks.imageLinks[wraparound(slideshowIndex - 0, images)];
        var nextImage = imageLinks.imageLinks[wraparound(slideshowIndex + 1, images)];
        var nextNextImage = imageLinks.imageLinks[wraparound(slideshowIndex + 2, images)];
        
        return(
        <div clasName="hobby-statement">
            <div>
                <div onClick={indexUp} style={{zIndex: -150}}>
                    <HobbySlideshowImage 
                    imageLink = {prevPrevImage} 
                    renderParam = {-2 + renderOffset}
                    zIndex = {0}/>
                </div>

                <div onClick={indexUp} style={{zIndex: -50}}>
                    <HobbySlideshowImage 
                    imageLink = {prevImage} 
                    renderParam = {-1 + renderOffset}
                    zIndex = {150}/>
                </div>

                <div style={{zIndex: 0}}>
                    <HobbySlideshowImage 
                    imageLink = {currImage} 
                    renderParam = {0 + renderOffset}
                    zIndex = {300}/>
                </div>

                <div onClick={indexDown} style={{zIndex: -100}}>
                    <HobbySlideshowImage 
                    imageLink = {nextImage} 
                    renderParam = {1 + renderOffset}
                    zIndex = {150}/>
                </div>

                <div onClick={indexDown} style={{zIndex: -200}}>
                    <HobbySlideshowImage 
                    imageLink = {nextNextImage} 
                    renderParam = {2 + renderOffset}
                    zIndex = {0}/>
                </div>
            </div>

            <div style={{
                marginLeft: "20px",
                marginRight: "40px",
                marginBottom: "50px",
                maxWidth: "500px",
                textAlign:"center",
                }}>
                    <p>
                        {"Click on the boxes to learn more about each experience!"}
                    </p>
                </div>
        </div>);
    } else {
        return <div></div>;
    }
}

export default HobbySlideshow;