// This Component displays a Deck Preview from Deck .JSON info

import { React, useEffect, useState } from "react";
import './DeckTileObject.css'
import * as server from '../../functions/ServerTalk.js';
import { useNavigate } from 'react-router-dom';

const DeckTileObject = (props) => {
    const [state, setState] = useState({
        data: props.data,
        // Find image link
        imgLink: props.data.cover_art,
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
        if (props.data.cover_art !== null){
            // Replace all ' with " for.. JSON reasons
            imgLink = props.data.cover_art
        }
        else {
            //Card back, placeholder image
            imgLink = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
        }
        return imgLink
    }

    return(
        <div
            className="DeckTileObjectContainer"
            style={{backgroundImage: 'radial-gradient( rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.3) ), url(' + state.imgLink + ')'}}
        >
            <a 
                href={state.url}
            >
                <div className="DeckClickable">
                    <div className="DeckInfo">
                        <div className="DeckTitle">{state.data.name}</div>
                        <div className="DeckAuthor">{state.data.format}</div>
                        <div className="DeckFormat">{state.data.user_name}</div>
                    </div>
                </div>
            </a>
        </div>

    );
    
};

export default DeckTileObject