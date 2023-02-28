import React from 'react';

const HobbyStatement = ({
    description,
}) => {
    return (<div className="hobby-statement">
        <h3>___</h3>
        {description}
        <br></br>
        <p>
            {"Click on the images in the back to cycle through the gallery! "}
        </p>
    </div>);
};

export default HobbyStatement;