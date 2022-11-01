import { React } from "react";
import CardObject from "../CardObject/CardObject";

const CardStack = (props) => {
    return (<div style={{display: 'flex', flexFlow: 'column', gap: "16px"}}>
        {props.label}
        {props.cards.map((card, index) => (
            <CardObject key={index} data={card} isCompact={props.isCompact} clickable/>
        ))}
    </div>)
}

export default CardStack;