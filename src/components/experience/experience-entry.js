import React, { useState, useEffect } from "react";
import { interpolateTrig } from "../../utils/functions";
import "../../index.css";
import { Color, interpolateColor, THEME_GREEN, THEME_GRAY_4B, THEME_GRAY_6B, THEME_GRAY_6H, WHITE, themeTransientCycle, THEME_GRAY_4H } from "../../utils/colors";

const ExperienceEntry = (props) => {
    
    const incrementSize = 0.05;
    const tickLength = 10;

    const [isHovering, setIsHovering] = useState(false);
    const [hoverParam, setHoverParam] = useState(0);
    const [transient, setTransient] = useState(0);
    const [isSelected, setIsSelected] = useState(false);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTransient(isSelected ? (transient < 1 ? transient + incrementSize : 1)
                : (transient > 0 ? transient - incrementSize : 0));
            setHoverParam(isHovering ? (hoverParam < 1 ? hoverParam + incrementSize : 1) 
                : (hoverParam > 0 ? hoverParam - incrementSize : 0));
        }, 10);
        return () => clearInterval(interval);
      }, [transient, setTransient, isSelected, hoverParam, setHoverParam, isHovering, setIsHovering]);

    useEffect(() => {
        setIsSelected(props.thisIndex == props.selectedIndex);
    }, [props.selectedIndex]);

    const select = () => {
        props.selectIndex(props.thisIndex == props.selectedIndex ? -1 : props.thisIndex);
    };

    // Rendering
    var windowHeight = interpolateTrig(0, 450, transient).toString() + "px";
    var verticalPadding = interpolateTrig(0, 20, transient).toString() + "px";
    var overlayOpacity = interpolateTrig(0, 1, hoverParam).toString();
    var renderColor = interpolateColor(THEME_GRAY_6B, THEME_GRAY_6H, hoverParam, interpolateTrig);
    var overlayOpacity = interpolateTrig(0, 1, hoverParam).toString();

    return (
        <div 
        onClick={() => select()} 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
            <div className="experience-entry"style={{
                height: "100px",
                borderColor: (transient > 0 ?
                    themeTransientCycle(THEME_GREEN, renderColor, 1 - transient, interpolateTrig).getHex()
                    :
                    renderColor.getHex()),
                borderWidth: "1.5px",
                borderBottomLeftRadius: transient > 0 ? "0px" : "10px",
                borderBottomRightRadius: transient > 0 ? "0px" : "10px",
                overflow: "hidden",
            }}>
                <div>
                    <div className="entry-overlay-hue">
                        <div style={{
                            backgroundColor: transient > 0 ?
                            themeTransientCycle(THEME_GREEN, renderColor, 1 - transient, interpolateTrig).getHex()
                            :
                            renderColor.getHex(),
                            minHeight: "500px",
                            minWidth: "500px",
                            marginLeft: "-20px",
                            marginTop: "-20px",
                            opacity: overlayOpacity, 
                        }}>
                        </div>
                    </div>
                    <div style={{
                        fontSize: "14px",
                        fontFamily: 'Nunito Regular',
                        color: THEME_GRAY_6H.getHex(),
                        float: "left",
                    }}>
                        {props.contents.location}
                    </div>

                    <div style={{
                        fontSize: "14px",
                        fontFamily: 'Nunito Regular',
                        color: THEME_GRAY_6H.getHex(),
                        float: "right",
                    }}>
                        {props.contents.date}
                    </div>
                </div>

                <div style={{
                    clear: "left",
                }}>
                    <div style={{
                        fontFamily: 'Nunito Bold',
                        fontSize: "24px",
                        marginTop: "10px",
                        marginBottom: "10px",
                        float: "left",
                    }}>
                        {props.contents.company}
                    </div>
                </div>
                
                <div style={{
                    clear: "left",
                }}>
                    <div style={{
                        float: "left",
                        fontFamily: 'Nunito Bold',
                        fontSize: "18px",
                        color: THEME_GREEN.getHex(),
                    }}>
                        {props.contents.title}
                    </div>
                </div>

                <div style={{
                    float: "right",
                    fontSize: "18px",
                    fontFamily: 'Nunito Bold',
                    color: THEME_GRAY_4H.getHex(),
                }}>
                    {isSelected ? "⌃" : "⌄"}
                </div>
            </div>
            {transient > 0 && 
                <div className="experience-entry-description" style={{
                    height: windowHeight,
                    paddingTop: verticalPadding,
                    paddingBottom: verticalPadding,
                    overflow: "hidden",
                }}>
                    {props.children}
                </div>
            }
        </div>
        
    );
}

export default ExperienceEntry;