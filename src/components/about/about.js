import React from 'react';
import '../../index.css';


function About() {
    return (
        <div className="about-section">
            <div className="about-section-overlay">
                <img src="assets/about_me/background.jpg" width="2000px"/>
            </div>
            <div className="about-section-overlay">
                <img src="assets/about_me/background.jpg" width="2000px"/>
            </div>
            <div className="about-description">
                <h2>{"About Me"}</h2>
                <h2>{"___"}</h2>
                <br></br>

                <p>
                    {"I first got into programming and design in middle school through making games in Python, JS, and Scratch, inspired by graphics of my favorite websites and games. "}
                    {"I've recently graduated in UC Berkeley where I studied Computer Science and Physics, and gained experience at both fast-growing and well-established companies like Amazon and NimbleRx. "}
                </p>
                <br></br>

                <p>
                    {"Aside from software and physics, I've spent much of my life exploring music and art, which have given me creative ideas and insights I hope to bring to the development process. "}
                    {"In turn, studying computer science has helped me understand these artistic subjects at a quantitative level through an analytic, problem-solving lens. "}
                    {"I believe that code is one of the most versatile creative mediums, and software can give us the power to express ourselves as much as it already positively impacts our lives. "}
                </p>
                <br></br>
                
                <p>
                    {"I am currently seeking work as a software engineer and I'm always interested in challenges, synergy, and impact; reach out via my email or LinkedIn to connect!"}
                </p>
                <br></br>

            </div>
        </div>
    );
}

export default About;