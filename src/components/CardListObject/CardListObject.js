// This Component displays a Card Image from Card .JSON info

import { React, useState, useEffect } from "react";
import './CardListObject.css'
import * as server from '../../functions/ServerTalk.js';
import { useNavigate } from 'react-router-dom';

const CardListObject = (props) => {

    const [state, setState] = useState({
        data: props.data,
        // Create page url
        url: server.buildRedirectUrl("/deck/?id=" + props.data.id)

    })

    const nav = useNavigate()

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
            ...previous,
            ...objectToUpdate
        }))
    }
    
    function getData() {
        updateState({ 
            data: props.data, 
            url: server.buildRedirectUrl("/deck/?id=" + props.data.id
        )})
    }

    useEffect(() => {
        getData()
    }, [props])
    
    return(
        <div 
            className="CardListObjectContainer"
        >
            <a 
                href={state.url}
            >
                <div className="CardListInfo">
                    <div className="CardListContent">
                        {state.data.name} 
                    </div>
                    <div className="CardListContent">
                        {/* {this.state.data.set_shorthand.toUpperCase()} */}
                    </div>
                </div>
            </a>
        </div>

    );
};

export default CardListObject