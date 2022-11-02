// This Component displays a Deck Preview from Deck .JSON info

import { React, useEffect, useState } from "react";
import './DeckTileObject.css'
import * as utilities from '../../functions/Utilities';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const DeckTileObject = (props) => {
    const [state, setState] = useState({
        data: props.data,
        // Find image link
        imgLink: props.data.cover_art,

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
            imgLink: getImage()
        })
    }
    
    function getImage(){
        let imgLink = ""
        if (props.data.cover_art !== null){
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
            <Link to={"/deck/?id=" + (props.data.id || props.data.deck_id)}>
                <div className="DeckClickable">
                    <div className="DeckInfo">
                        <div className="DeckTitle">{state.data.name.substring(0,25).trim()}{state.data.name.length > 20 && "..."}</div>
                        <div className="DeckAuthor">{utilities.getProperFormatName(state.data.format)}</div>
                        <div className="DeckFormat">{state.data.user_name}</div>
                    </div>
                </div>
            </Link>
        </div>

    );
    
};

export default DeckTileObject