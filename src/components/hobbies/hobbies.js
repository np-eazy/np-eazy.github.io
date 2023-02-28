import React, { useEffect, useState } from 'react';
import '../../index.css';
import { THEME_GRAY_4H } from '../../utils/colors';

import {default as HobbyButton} from './hobby-button';
import {default as HobbyDisplay} from './hobby-display';


function Hobbies() {

  // Selection Logic
  const [index, setIndex] = useState(0);

    return (
        <div>
            <div className="hobbies-menu">
                <HobbyButton 
                label = "graphic design" 
                selectedIndex = {index}
                selectIndex = {setIndex}
                thisIndex = {0} />

                <HobbyButton 
                label = "visual art" 
                selectedIndex = {index}
                selectIndex = {setIndex}
                thisIndex = {1} />

                <HobbyButton 
                label = "music" 
                selectedIndex = {index}
                selectIndex = {setIndex}
                thisIndex = {2} />

            </div>

            <div className="hobbies">
                <HobbyDisplay
                    selectedIndex = {index}
                    contents = {[{
                            "description": <div>
                                <p>{"I have not thoroughly studied design, but I've picked up practice and skills throughout high school and university for class projects, clubs, and small personal games. Displayed are some course stickers and merch designs I made as a member of Berkeley IEEE."}</p>
                            </div>,
                            "imageLinks": [
                                "assets/gallery/graphic-design/ieee-ee130.png",
                                "assets/gallery/graphic-design/ieee-ee122.png",
                                "assets/gallery/graphic-design/ieee-ee123.png",
                                "assets/gallery/graphic-design/ieee-ee140.png",
                                "assets/gallery/graphic-design/ieee-shirt.png",
                            ]
                        },
                        {
                            "description": <p style={{color:THEME_GRAY_4H.getHex()}}>{"I have taken drawing, oil painting, and digital art lessons for a total of three years. My favorite art styles are Impressionism and Cubism."}</p>,
                            "imageLinks": [
                                "assets/gallery/visual-art/owl-painting.png",
                                "assets/gallery/visual-art/bear-painting.png",
                                "assets/gallery/visual-art/fox-painting.png",
                                "assets/gallery/visual-art/rift-field.png",
                                "assets/gallery/visual-art/zebra-painting.png",
                            ]
                        },
                        {
                            "description": <div>
                                <p>{"I have been classically trained in piano from the age of 4, and spent much of my time in high school studying and preparing for local and national competitions. My teachers included Tamriko Siprashvili, Jed Galant, and Olya Katsman. Now I play more casually and focus on improvisation, jazz, and accompanying other instruments."}</p>
                                <p>{"I have also studied cello since the age of 8, and I've performed as Principal Cellist of Golden State Youth Orchestra, which has toured several countries in central and East Europe. "}</p>
                                <p>{"I hope to learn more digital music production and disc jockeying soon when I get the time. "}</p>
                            </div>,
                            "imageLinks": [
                                "assets/gallery/music/piano-carnegie.jpg",
                                "assets/gallery/music/piano-ecys.jpg",
                                "assets/gallery/music/cello-ucsc.jpg",
                            ]
                        }]
                    } />
            </div>
        </div>
    );
}

export default Hobbies;