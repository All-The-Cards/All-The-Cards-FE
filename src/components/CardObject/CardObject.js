// This Component displays a Card List View from Card .JSON info

import { React, useState, useEffect } from "react";
import './CardObject.css'
import * as server from '../../functions/ServerTalk.js';
import { useNavigate } from 'react-router-dom';
import Card from "../../pages/Card";

const CardObject = (props) => {
    const [state, setState] = useState({
        data: props.data,
        // Create page url
        url: server.buildRedirectUrl("/deck/?id=" + props.data.id),
        imgLink: getImage()

    })
    const nav = useNavigate()

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
            ...previous,
            ...objectToUpdate
        }))
    }

    useEffect(() => {
        getData()
    }, [props])

    function getData(){
        updateState({
            data: props.data,
            url: server.buildRedirectUrl("/deck/?id=" + props.data.id),
            imgLink: getImage()
        })
    }

    function getImage(){
        let imgLink = ""
        if (props.data.image_uris !== null){
            // Replace all ' with " for.. JSON reasons
            imgLink = JSON.parse(props.data.image_uris.replaceAll('\'', '\"' )).png
        }
        else {
            //Card back, placeholder image
            imgLink = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
        }
        return imgLink
    }

    return(
        <div 
            className="CardObjectContainer"
        >
            <a 
                href={state.url}
            >
                <img 
                    src={state.imgLink}
                    className="CardObjectImage">
                </img>
            </a>
        </div>

    );
};

export default CardObject