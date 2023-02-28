import React from "react";

const Calendar = (props) => {
    return (
        <div>
            <iframe src="https://calendar.google.com/calendar/embed?src=cb1b3aa5f21d7c73f794af56d840108eac85142181d7f93901dfb0bb8889b684%40group.calendar.google.com&ctz=America%2FLos_Angeles" 
            style={{
                border:"solid 0px #777", 
                width:1100, 
                height:600, 
                frameborder:"0"}}></iframe>
        </div>
    );
}

export default Calendar;