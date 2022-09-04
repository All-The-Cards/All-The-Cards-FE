import { React } from "react";
import CardObject from "../CardObject/CardObject";

const CardStack = (props) => {
    return (<div style={{display: 'flex', flexFlow: 'column'}}>
        {props.label}
        {props.cards.map((card, index) => (
            <CardObject data={card} isCompact={props.isCompact}/>
        ))}
    </div>)
}

export default CardStack;