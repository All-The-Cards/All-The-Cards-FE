// This Component displays a Card List View from Card .JSON info

import { React, useState, useEffect } from "react";
import './CardObject.css'
import * as server from '../../functions/ServerTalk.js';
import { useNavigate } from 'react-router-dom';
import Card from "../../pages/Card";

import flipIcon from './rotate-right.png'
const CardObject = (props) => {
    const [state, setState] = useState({
        isFlipped: false,
        data: { 
            card_faces: [],
            layout: ""
        },
        listBackgroundColor: "",
        listAltColor:"",
        manaCostSymbols: "",
        maxNameLength: 24,
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
            imgLink: getImage(),
        })
        generateListBackgroundColor()
        getManaSymbols()
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

    function generateListBackgroundColor(){
        let bgclr = "#cbd3d3"
        let altclr = "#959f9e"
        let colors = 0
        if (props.data.color_identity !== null) {
            for (let i = 0; i < props.data.color_identity.length; i++){
                switch (props.data.color_identity[i]){
                    case 'W':
                        bgclr = "#e1dfd9"
                        altclr = "#e9e8e4"
                        colors++
                        break;
                    case 'U':
                        bgclr = "#84bad9"
                        altclr = "#0880c3"
                        colors++
                        break;
                    case 'B':
                        bgclr = "#a29d9a"
                        altclr = "#3b3b38"
                        colors++
                        break;
                    case 'R':
                        bgclr = "#f4b09a"
                        altclr = "#aa230e"
                        colors++
                        break;
                    case 'G':
                        bgclr = "#adcebd"
                        altclr = "#025434"
                        colors++
                        break;

                }
                
                if (colors > 1) {
                    bgclr = "#d6be73"
                    altclr = "#efd26e"
                }
            }

            updateState({
                listBackgroundColor: bgclr,
                listAltColor: altclr
            })
        }
    }

    function getManaSymbols(){
        if (props.data.card_faces){
            updateState({
                manaCostSymbols: props.data.card_faces[0].mana_cost
            })
        }
        else {
            updateState({
                manaCostSymbols: props.data.mana_cost
            })
        }
    }


    return (
        <>
            {props.isCompact === true ? <div
                className="CardListObjectContainer"
                // style={{backgroundColor:state.listBackgroundColor, boxShadow: '0px 0px 0px 2px ' + state.listAltColor + ' inset'}}
                style={{backgroundColor:state.listBackgroundColor}}
            >
                <a
                    href={state.url}
                >
                    <div className="CardListInfo">
                        <div className="CardListContent" id="cardListLeft" style={{fontWeight: 'bold'}}>
                            {(state.data !== undefined && state.data.name !== undefined) ? (props.count > 1 ? props.count + "x " : "") + state.data.name.split('/')[0].trim().slice(0,state.maxNameLength) + (state.data.name.split('/')[0].trim().length > state.maxNameLength ? "..." : "")  : <></>}
                        </div>
                        <div className="CardListContent"id="cardListRight">
                            {state.manaCostSymbols}
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
                    { (state.data.card_faces && state.data.layout === "transform" || state.data.layout === "modal_dfc") &&
                        <div className="flipBox"
                        onClick={flipArt}>
                            <img src={flipIcon} className="flipIcon" style={{transform: 'scaleX(' + transformFlipIcon() + ')'}}></img>
                        </div>
                    }
                </div>}

        </>
    );
};

export default CardObject