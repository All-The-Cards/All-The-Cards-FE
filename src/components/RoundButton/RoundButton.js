import React from "react";
import "./RoundButton.css"
const RoundButton = ({ onClick, icon }) => {
    return (
        <div className="roundButton">
            <img src={icon} className="buttonIcon" onClick={onClick} />
        </div>
    )
}
export default RoundButton;