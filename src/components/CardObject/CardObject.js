// This Component displays a Card List View from Card .JSON info

import { React, useState, useEffect } from "react";
import './CardObject.css'
import * as server from '../../functions/ServerTalk.js';
import { useNavigate } from 'react-router-dom';
import Card from "../../pages/Card";

const CardObject = (props) => {
    const [state, setState] = useState({

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

    function getData() {
        updateState({
            data: props.data,
            url: server.buildRedirectUrl("/card/?id=" + props.data.id),
            imgLink: getImage()
        })
    }

    function getImage() {
        let imgLink = ""
        if (props.data.card_faces){
            // console.log(props.data.card_faces)
            imgLink = props.data.card_faces[0].image_uris.png
            return imgLink
        }
        if (props.data.image_uris !== null) {
            imgLink = props.data.image_uris.png
            return imgLink
        }
        imgLink = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
        return imgLink
    }

    return (
        <>
            {props.isCompact === true ? <div
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
                : <div
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
                </div>}

        </>
    );
};

export default CardObject