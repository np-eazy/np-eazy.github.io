import React from "react";
import { THEME_GREEN_HEX, THEME_GRAY_4H_HEX} from "../../utils/colors";

const SkillDisplay = ({
    selectedIndex,
    contents,
}) => {

    return (
        <div style={{
            maxWidth: "600px",
        }}>
            {Object.entries(contents.skillSections).map(
                ([skillSectionName, skills]) => {
                    return (
                        <div key={skillSectionName} style={{
                            margin: "20px",
                            float: "left",
                            minWidth: "250px",
                            marginLeft: "10px",
                            minHeight: "150px",
                        }}>
                            {Object.entries(skills).map(
                                ([skillName, experiences]) => {

                                    var selected = false;
                                    for (var j = 0; j < experiences.length; j++) {
                                        if (experiences[j] == selectedIndex) {
                                            selected = true;
                                        }
                                    }
                                    return (
                                        <div key={skillName}
                                        className="skill">
                                            <div
                                            style={{
                                                color: selected ? THEME_GREEN_HEX : THEME_GRAY_4H_HEX,
                                            }}>
                                                {skillName}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )
                }
            )

            }
        </div>
    );
}

export default SkillDisplay;
