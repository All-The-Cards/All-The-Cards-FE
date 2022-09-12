// This Component displays a Card List View from Card .JSON info

import { React, useState, useEffect, useContext } from "react";
import './CardObject.css'
import * as server from '../../functions/ServerTalk.js';
import { useNavigate } from 'react-router-dom';
import Card from "../../pages/Card";

import flipIcon from './rotate-right.png'

import plusIcon from './plus-solid.svg'
import minusIcon from './minus-solid.svg'


import { GlobalContext } from "../../context/GlobalContext";
const CardObject = (props) => {
    const [state, setState] = useState({
        isFlipped: false,
        data: { 
            card_faces: [],
            layout: ""
        }
    })

    const {wipDeck, setWipDeck} = useContext(GlobalContext)

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
        if (props.data.image_uris !== null) {
            imgLink = props.data.image_uris.png
            return imgLink
        }
        if (props.data.card_faces){
            // console.log(props.data.card_faces)
            imgLink = props.data.card_faces[0].image_uris.png
            return imgLink
        }
        imgLink = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
        return imgLink
    }

    function flipArt() {
        if (state.data.card_faces) {
            let img = ""
            switch (state.isFlipped){
                case true:
                    img = state.data.card_faces[0].image_uris.png
                    break
                case false: 
                    img = state.data.card_faces[1].image_uris.png
                    break
            }
    
            updateState({
                isFlipped: !state.isFlipped,
                imgLink: img
            })
        }
    }

    function transformFlipIcon(){
        switch (state.isFlipped){
            case true: 
                return -1
                break;
            case false:
                return 1
                break;
        }
    }

    const toggleInDeck = () => {
        let index = wipDeck.cards.indexOf(props.data) 
        if(index === -1) {
            wipDeck.cards.push(props.data)
        }
        else{
            wipDeck.cards.splice(index,1)
        }
        console.log(props.data)
        console.log(wipDeck.cards)
    }

    return (
        <div className="RegularCard">
            {props.isCompact === true ? <div
                className="CardListObjectContainer"
            >
                <a
                    href={state.url}
                >
                    <div className="CardListInfo">
                        <div className="CardListContent">
                            {(state.data !== undefined && state.data.name !== undefined) ? state.data.name : <></>}
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
                    { (state.data.card_faces && state.data.layout === "transform") &&
                        <div className="flipBox"
                        onClick={flipArt}>
                            <img src={flipIcon} className="flipIcon" style={{transform: 'scaleX(' + transformFlipIcon() + ')'}}></img>
                        </div>
                    }
                    <div className="plusMinusBox" onClick={toggleInDeck}>
                        {(wipDeck.cards != undefined) && (wipDeck.cards.indexOf(props.data) != -1) ? <img src={minusIcon} className="plusMinusIcon" /> : <img src={plusIcon} className="plusMinusIcon" />}
                        
                    </div>
                </div>}

        </div>
    );
};

export default CardObject