import React, { useEffect, useState } from 'react';
import '../../index.css';

import { default as ExperienceEntry } from './experience-entry';
import StatementDisplay from './statement-display';
import SkillDisplay from './skill-display';
import ProjectEntry from './project-entry';
import { WHITE } from '../../utils/colors';


function Experience() {

  // Idle loop to update transition states
  let transientIncrement = 0.02;
  const [transient, setTransient] = useState(0);

  // Selection Logic
  const [index, setIndex] = useState(-1);

  // Rendering
  return (
    <div className="experience-section">
      <div style={{float:"left"}}>
        <StatementDisplay props = {{
          statement: "lorem ipsum",
        }}>
          <div className="statement-box">
              ___
              <br></br>
              <br></br>
              {"I love learning and experiencing processes where innovative ideas give rise to impactful products that truly benefit users."}
          </div>
        </StatementDisplay>
      </div>

      <div style={{
        marginTop: "350px",
        minHeight: "10px",
        minWidth: "10px",
        float: "left",
      }}>
      </div>
      
      <div style={{
        float:"right",
        }}>
        <ExperienceEntry 
        selectedIndex = {index}
        selectIndex = {setIndex}
        thisIndex = {0}
        contents = {{
          location: "Berkeley, CA",
          date: "AUG 2019 - DEC 2022",
          company: "University of California, Berkeley",
          title: "B.A. Computer Science, Physics Minor",
          thumbnailLink: "assets/experience/ucb-logo.png",
        }}>
          <div>
            <p>
              <a href="https://github.com/np-eazy/fa22-cs182-proj">
                <i className="fa fa-external-link" aria-hidden="true"></i>
                {" CS 182 Project: Quantum Solver Neural Network"}
              </a>
            </p>
            {/* <p>{"CS 161: Computer Security"}</p>
            <p>{"CS 170: Efficient Algorithms and Intractable Problems"}</p>
            <p>{"EECS 126: Probability Theory and Stochastic Processes"}</p>
            <p>{"CS 182: Deep Learning and Neural Networks"}</p>
            <p>{"CS 189: Machine Learning"}</p>
            <br></br>
            <p>{"Physics 105: Analytic Mechanics (Taylor)"}</p>
            <p>{"Physics 110A: Electrodynamics (Griffiths)"}</p>
            <p>{"Physics 137: Quantum Mechanics (Griffiths, Townsend)"}</p>
            <p>{"Physics 112: Statistical Physics (Kittel)"}</p> */}
          </div>
        </ExperienceEntry>

        <ExperienceEntry 
        selectedIndex = {index}
        selectIndex = {setIndex}
        thisIndex = {1}
        contents = {{
          location: "Seattle, WA",
          date: "JAN 2022 - MAY 2022",
          company: "Amazon",
          title: "Fullstack Software Engineer (Intern)",
          thumbnailLink: "assets/experience/amazon-logo.png",
        }}>
          <div>
            <p>
              <a href="https://www.amazon.jobs/en/job_categories/legal">
                <i className="fa fa-external-link" aria-hidden="true"></i>
                {" About Amazon Legal"}
              </a>
            </p>
            <p>
              <a href="https://docs.google.com/presentation/d/15Std3z7t5vRNOcDTAjejsS1LZsHvqzqC/edit#slide=id.g1e023731a5e_0_77">
                <i className="fa fa-external-link" aria-hidden="true"></i>
                {" Intern Project Presentation"}
              </a>
            </p>
            <br></br>
            <p>
              {"  At Amazon I had the opportunity to thoroughly develop the skills and experience encompassed by a full software dev life cycle, "}
              {"in which I designed, developed, and deployed an internal app feature with an AWS backend and React frontend"}
              {"This feature was an auto-emailing form allowing lawyers to conveniently request and approve viewing permissions to legal documents, "}
              {"and saved 3 hours per month for about 1,000 lawyers, managing over 10,000 documents."}
              {"Read more about my project and experience at the presentation linked above. "}
            </p>
          </div>
        </ExperienceEntry>

        <ExperienceEntry 
        selectedIndex = {index}
        selectIndex = {setIndex}
        thisIndex = {2}
        contents = {{
          location: "Redwood City, CA",
          date: "MAY 2022 - AUG 2022",
          company: "NimbleRx Pharmacy",
          title: "Backend Software Engineer (Intern)",
          thumbnailLink: "assets/experience/nimblerx-logo.jpg",
        }}>
          <div>
            <p>
              <a href="https://www.nimblerx.com/about">
                <i className="fa fa-external-link" aria-hidden="true"></i>
                {" About NimbleRx"}
              </a>
            </p>
            <br></br>
            <p>
              {"  At NimbleRx I worked on a variety of tasks to refactor and improve backend infrastructure. "}
              {"I replaced Spring XMLs configuring infrastructure components with Java annotations to improve the format of over a hundred files throughout the codebase, "}
              {"and implemented ExecutorService multithreading in cron jobs processing user shopping cart data. "}
            </p>
            <p>
              {"  I also designed architecture to augment and pipeline SMS-triggered webhook data into an ElasticSearch stack, which handles thousands of user requests and actions per hour. "}
            </p>
          </div>
        </ExperienceEntry>

        <ExperienceEntry 
        selectedIndex = {index}
        selectIndex = {setIndex}
        thisIndex = {3}
        contents = {{
          location: "Berkeley, CA",
          date: "AUG 2019 - DEC 2022",
          company: "Lawrence Berkeley Ntl. Lab",
          title: "Software Engineer and Researcher (Intern)",
          thumbnailLink: "assets/experience/lbnl-logo.jpg",
        }}>
          <div>
            <p>
              <a href="https://github.com/ECP-WarpX/impactx/issues/104#issuecomment-1275922946">
                <i className="fa fa-external-link" aria-hidden="true"></i>

                {" About ImpactX"}
              </a>
            </p>
            <p>
              <a href="https://github.com/ECP-WarpX/impactx/issues/104#issuecomment-1275922946">
                <i className="fa fa-external-link" aria-hidden="true"></i>

                {" MadX Parser Design Notes"}
              </a>
            </p>
            <br></br>
            <p>
              {"  During my last semester, I briefly part-time interned with the ATAP (Accelerator Tech and Applied Physics) Division of LBNL, where I added SIMD performance improvements to a state-of-the-art plasma simulation. "}
              {"Towards the end of my internship I also discovered and designed a robust REPL solution to parsing CERN particle accelerator commands into LBNL simulation input files, "}
              {"and did preliminary research and reading which I have documented before the end of my internship. "}
            </p>
          </div>
        </ExperienceEntry>
        <div style={{marginTop: "100px"}}></div>

        <div style={{marginBottom: "50px"}}>
          <ProjectEntry 
          selectedIndex = {index}
          selectIndex = {setIndex}
          thisIndex = {4}
          contents = {{
            location: "Home",
            date: "FEB 2023 - Present",
            projectName: "Atom Visualizer",
            projectDesc: "Personal Project",
            thumbnailLink: "assets/projects/atom.gif",
          }}>
            <div style={{
              color: WHITE.getHex(),
            }}>
              <p>
                <a href="https://github.com/np-eazy/electron-cloud">
                  <i class="fa fa-external-link" aria-hidden="true"></i>
                  {" Github Link"}
                </a>
              </p>
              <br></br>
              <p>
                {"  A simulation of a 3D hydrogen(ic) atom, with an electron cloud simulated with particles moving along Bohmian trajectories updated with Runge-Kutta. "}
                {"  It currently runs on Python and TKinter, but will soon be implemented in C/Rust and rendered using Blender integrations. "}
              </p>
              <p>   
                {"The underlying pilot wave theory of Schrodinger's Equation is rather limited, but its visualizations simultaneously capture both our classical and quantum intuitions of the atom. "} 
              </p>
            </div>
          </ProjectEntry>
        </div>

        <div style={{
          marginLeft: "20px",
          marginRight: "40px",
          marginBottom: "50px",
          maxWidth: "500px",
          float:"right",
          textAlign:"center",
        }}>
          <p>
            {"Click on the boxes to learn more about each experience!"}
          </p>
        </div>
      </div>

      <div style={{float:"left"}}>
        <SkillDisplay 
        selectedIndex = {index}
        contents={{
          skillSections: {
            "Frontend Languages": { 
              "React.js": [1],
              "Javascript": [0, 1],
              "Typescript": [1],
              "HTML": [1],
              "CSS": [1],
            },

            "Backend Languages": {
              "AWS DynamoDB": [1],
              "AWS SQS": [1, 2],
              "AWS S3": [1, 2],
              "Spring Boot": [2],
            },
            
            "Development Tools": {
              "CI/CD Development": [1, 2],
              "Git, Github": [0, 1, 2, 3],
              "AWS Cloudwatch": [1, 2],
              "Jenkins": [2],
              "Adobe Photoshop": [0],
              "Adobe Illustrator": [1],
            },

            "Software Practices": {
              "SDLC": [1, 2, 3],
              "Agile Development": [1],
              "Business Software": [1, 2, 3],
              "Customer Software": [2, 3],
              "Physics Simulations": [3, 4],
              "Quantitative Analysis": [0, 3],
            },

            "Backend Languages": {
              "Java (8)": [0, 1, 2],
              "Python (3)": [0, 3, 4],
              "C++ (17)": [0, 3, 4],
              "Golang": [0],
              "OpenMP": [0, 3, 4],
              "ExecutorService": [2],
            },

            "Computer Science Subjects": {
              "Machine Learning": [0],
              "Deep Neural Networks": [0],
              "Cybersecurity": [0],
              "Efficient Algorithms": [0, 4],
            },

            "Physics Subjects": {
              "Probabilistic Modeling": [4],
              "Quantum Mechanics": [4],
              "Statistical Mechanics": [0],
              "Analytical Mechanics": [0],
              "Plasma Dynamics": [0, 3],
            },
          }
        }}/>
      </div>

    </div>
  );
}

export default Experience;