// This Component displays a Card List View from Card .JSON info

import { React, useState, useEffect } from "react";
import './CardObject.css'
import * as server from '../../functions/ServerTalk.js';
import { useNavigate } from 'react-router-dom';
import Card from "../../pages/Card";
// import 'mana-font/css/mana.css'
import { Mana } from "@saeris/react-mana";
import * as mana from '../../components/TextToMana/TextToMana.js'

import flipIcon from './rotate-right.png'
import { generateSymbols } from "../TextToMana/TextToMana";
const CardObject = (props) => {
    const [state, setState] = useState({
        isFlipped: false,
        data: { 
            card_faces: [],
            layout: ""
        },
        listBackgroundColor: "",
        listBackgroundColorV2: "",
        listAltColor:"",
        manaCostSymbols: "",
        maxNameLength: getMaxLength(),
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
    function getMaxLength(){
        let mana = 0
        if (props.data.mana_cost) {
            mana = props.data.mana_cost.length
        }
        if (props.data.card_faces){
            mana = props.data.card_faces[0].mana_cost.length
        }
        mana = mana / 3
        console.log(mana)
        if (mana < 6) return 25 - mana
        else return 15 - mana
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
        let bgclr2 = "#cbd3d3"
        let colors = 0
        let colorobject = ""
        if (props.data.colors){
            colorobject = props.data.colors
        }
        else if (props.data.card_faces){
            colorobject = props.data.card_faces[0].colors
        }
        // console.log(colorobject)
        if (colorobject !== undefined) {
            for (let i = 0; i < colorobject.length; i++){
                switch (colorobject[i]){
                    case 'W':
                        bgclr = "#e1dfd9"
                        bgclr2 = "#d8d7d5"
                        altclr = "#e9e8e4"
                        colors++
                        break;
                    case 'U':
                        bgclr = "#84bad9"
                        bgclr2 = "#c5d6eb"
                        altclr = "#0880c3"
                        colors++
                        break;
                    case 'B':
                        bgclr = "#a29d9a"
                        bgclr2 = "#bab7b9"
                        altclr = "#3b3b38"
                        colors++
                        break;
                    case 'R':
                        bgclr = "#f4b09a"
                        bgclr2 = "#eac3ad"
                        altclr = "#aa230e"
                        colors++
                        break;
                    case 'G':
                        bgclr = "#adcebd"
                        bgclr2 = "#c7d6ce"
                        altclr = "#025434"
                        colors++
                        break;

                }
                
                if (colors > 1) {
                    bgclr = "#d6be73"
                    bgclr2 = "#d6be73"
                    altclr = "#efd26e"
                }
            }

            updateState({
                listBackgroundColor: bgclr,
                listBackgroundColorV2: bgclr2,
                listAltColor: altclr
            })
        }
    }

    function getManaSymbols(){
        let rawMana = ""
        if (props.data.card_faces) rawMana = props.data.card_faces[0].mana_cost
        else rawMana = props.data.mana_cost
        
        
        updateState({manaCostSymbols: mana.generateSymbols(rawMana)})
    }


    return (
        <>
            {props.isCompact === true ? <div
                className="CardListObjectContainer"
                // style={{backgroundColor:state.listBackgroundColor, boxShadow: '0px 0px 0px 2px ' + state.listAltColor + ' inset'}}
                style={{backgroundColor:state.listBackgroundColorV2}}
            >
                <a
                    href={state.url}
                >
                    <div className="CardListInfo">
                        <div className="CardListContent" id="cardListLeft" style={{fontWeight: 'bold'}}>
                            {(state.data !== undefined && state.data.name !== undefined) ? (props.count > 1 ? props.count + "x " : "") + state.data.name.split('/')[0].trim().slice(0,state.maxNameLength).trim() + (state.data.name.split('/')[0].trim().length > state.maxNameLength ? "..." : "")  : <></>}
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