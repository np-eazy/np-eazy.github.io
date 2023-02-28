import React, { useEffect, useState } from 'react';
import '../../index.css';
import StatementDisplay from '../experience/statement-display';
import Calendar from './calendar';
import SideButton from '../menu/side-button';

function About() {
    return (
        <div className="contacts-section">
            <div className="contacts-section-overlay">
                <img src="assets/about_me/background.jpg" width="2000px"/>
            </div>
            <div className="contacts-section-overlay">
                <img src="assets/about_me/background.jpg" width="2000px"/>
            </div>
            <div style={{
                maxWidth: "800px",
            }}>
                <h2>Contacts</h2>
                <h2>___</h2>
                <br></br>
                <p>
                    {"Feel free to reach out via Email or LinkedIn! I am generally available from 11am to 5pm on Mondays, Tuesdays, and Wednesdays, and I am more than happy to schedule Google or Zoom calls during my available times below."}
                </p>
            </div>           
            <div style={{float:"left"}}>
                <SideButton
                    label = "Email"
                    navigation = "mailto:joey.j.zhu@gmail.com">
                    <i className="fa fa-envelope" fontSize="24px"></i>
                </SideButton>
                
                <SideButton
                    label = "Linkedin"
                    navigation = "https://www.linkedin.com/in/joey-j-zhu">
                    <i className="fa fa-linkedin-square" fontSize="24px"></i>
                </SideButton>

                <SideButton
                    label = "Github"
                    navigation = "https://github.com/np-eazy">
                    <i className="fa fa-github" fontSize="24px"></i>
                </SideButton>
            </div>
            <br></br>
            <br></br>
            <Calendar />
        </div>
    );
}

export default About;