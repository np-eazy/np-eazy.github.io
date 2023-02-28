import React from 'react';
import '../../index.css';
import DynamicText from './dynamic-text';
import { THEME_GRAY_6H } from '../../utils/colors';

import FoldCanvas from './fold-canvas';

function Fold() {
    return (
        <div className="fold-background">
            <div className="container">
                <div className="fold-background"><FoldCanvas height={600} width={1300}/></div>
               
                <div className="box overlay">
                    <div style={{
                        display:"flex",
                        float:"left", 
                    }}>
                        <img src="assets/cover-picture-cropped.jpg" className="cover-picture"></img>
                        <div className="fold-title" style={{
                            float:"right",
                        }}>
                            <h1>{"Hey, I'm Joey."}</h1>

                            <DynamicText
                            subtitle="Software engineer and aspiring multimedia artist from the Bay Area"
                            baseStyle={{
                                fontFamily:"Nunito Regular",
                                fontSize: "24px",
                                color: THEME_GRAY_6H.getHex()
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Fold;