// This Component displays a Card List View from Card .JSON info

import { React, useState, useEffect, useContext } from "react";
import './CardObject.css'
import * as server from '../../functions/ServerTalk.js';
import { useNavigate } from 'react-router-dom';
import Card from "../../pages/Card";
// import 'mana-font/css/mana.css'
import { Mana } from "@saeris/react-mana";
import * as mana from '../../components/TextToMana/TextToMana.js'

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
        },
        listBackgroundColor: "",
        listBackgroundColorV2: "",
        listAltColor: "",
        manaCostSymbols: "",
        maxNameLength: 0,
        listHover: false
    })

    const { hasSearchBar, setSearchBar } = useContext(GlobalContext)
    const { wipDeck, setWipDeck } = useContext(GlobalContext)

    const nav = useNavigate()

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
            ...previous,
            ...objectToUpdate
        }))
    }

    useEffect(() => {
        getData()
    }, [props, wipDeck])

    function getData() {
        updateState({
            data: props.data,
            url: "../card/?id=" + props.data.id,
            // url: server.buildRedirectUrl("/card/?id=" + props.data.id),
            imgLink: getImage(),
            listHover: false
        })
        if (props.isCompact) {
            generateListBackgroundColor()
            getManaSymbols()
            getFrontName()
            getMaxLength()
        }
    }
    function getFrontName() {
        if (props.data.card_faces && props.data.layout !== "split") {
            updateState((previous) => ({ data: { ...previous, name: props.data.card_faces[0].name } }))
        }
        if (props.data.layout === "split") {
            updateState((previous) => ({ data: { ...previous, name: props.data.name } }))
        }
    }
    function getMaxLength() {
        let mana = 0
        let nameLen = 0
        let count = 0
        if (props.data.mana_cost && props.data.layout !== "adventure" && props.data.layout !== "split") {
            mana = props.data.mana_cost
            nameLen = props.data.name.length
            count = (mana.match(/{/g || []).length)
        }
        else if (props.data.card_faces && props.data.card_faces[0].mana_cost && props.data.layout !== "split") {
            mana = props.data.card_faces[0].mana_cost
            nameLen = props.data.card_faces[0].name.length + 3
            count = (mana.match(/{/g || []).length)
        }
        else if (props.data.mana_cost) {
            mana = props.data.mana_cost.split("//")[0]
            nameLen = props.data.name.length
            count = (mana.match(/{/g || []).length)
            console.log('else')
        }
        else {
            nameLen = props.data.name.length
        }
        if (mana === 0) {
            updateState({
                maxNameLength: nameLen
            })
            return
        }
        if (props.count > 1) {
            nameLen += 5
        }

        //if more than 1 mana symbol, shorten
        if (count > 1) {
            if (props.count === undefined || props.count === 1) {
                if (nameLen > 25) nameLen -= count
            }
            if (count === 2) {
                if (nameLen * .75 > 21) nameLen *= .7
            }
            else if (count === 3) {
                if (nameLen * .7 > 19) nameLen *= .7
            }
            else if (count === 4) {
                if (nameLen * .7 > 16) nameLen *= .7
            }
            else if (count === 5) {
                if (nameLen * .7 > 15) nameLen *= .7
            }
            else if (count === 6) {
                if (nameLen * .7 > 13) nameLen *= .7
            }
            else if (count > 6 && count < 10) {
                nameLen *= .55
            }
            else if (count >= 10) {
                nameLen *= .25
            }
        }

        nameLen = Math.floor(nameLen)
        updateState({
            maxNameLength: nameLen
        })


    }

    function getImage() {
        let imgLink = ""
        if (props.data.image_uris !== null) {
            imgLink = props.data.image_uris.png
            return imgLink
        }
        if (props.data.card_faces) {
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
            switch (state.isFlipped) {
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

    function transformFlipIcon() {
        switch (state.isFlipped) {
            case true:
                return -1
            case false:
                return 1
        }
    }

    const toggleInDeck = () => {
        let index = wipDeck.cards.indexOf(props.data)
        let tempCards = wipDeck.cards
        if (index === -1) {
            tempCards.push(props.data)
        }
        else {
            tempCards.splice(index, 1)
        }
        setWipDeck((previous) => ({
            ...previous,
            cards: tempCards
        }))
        console.log(props.data)
        console.log(wipDeck.cards)
        // setSearchBar(!hasSearchBar)
        console.log(hasSearchBar)
    }

    function generateListBackgroundColor() {
        let bgclr = "#cbd3d3"
        let bgclr2 = "#dbdbe0"
        let altclr = "#959f9e"
        let colors = 0
        let colorobject = ""
        let splitcount = 0
        let symbolcount = 0
        let uniqueColors = 0
        let seenColors = [false, false, false, false, false]
        if (props.data.mana_cost) {
            if (props.data.layout === "adventure") {
                colorobject = props.data.mana_cost.split("//")[0]
            }
            else {
                colorobject = props.data.mana_cost
            }

        }
        else if (props.data.card_faces) {
            colorobject = props.data.card_faces[0].mana_cost
        }
        // else if (props.data.color_identity) {
        //     colorobject = props.data.color_identity
        // }
        if (colorobject !== undefined) {
            for (let i = 0; i < colorobject.length; i++) {
                switch (colorobject[i]) {
                    case 'W':
                        bgclr = "#e1dfd9"
                        bgclr2 = "#ebe6d9"
                        altclr = "#e9e8e4"
                        if (!seenColors[0]) uniqueColors++
                        seenColors[0] = true
                        colors++
                        break;
                    case 'U':
                        bgclr = "#84bad9"
                        bgclr2 = "#c5d6eb"
                        altclr = "#0880c3"
                        if (!seenColors[1]) uniqueColors++
                        seenColors[1] = true
                        colors++
                        break;
                    case 'B':
                        bgclr = "#a29d9a"
                        bgclr2 = "#bab7b9"
                        altclr = "#3b3b38"
                        if (!seenColors[2]) uniqueColors++
                        seenColors[2] = true
                        colors++
                        break;
                    case 'R':
                        bgclr = "#f4b09a"
                        bgclr2 = "#eac3ad"
                        altclr = "#aa230e"
                        if (!seenColors[3]) uniqueColors++
                        seenColors[3] = true
                        colors++
                        break;
                    case 'G':
                        bgclr = "#adcebd"
                        bgclr2 = "#c7dece"
                        altclr = "#025434"
                        if (!seenColors[4]) uniqueColors++
                        seenColors[4] = true
                        colors++
                        break;
                    case '{':
                        symbolcount++
                        break;
                    case '/':
                        splitcount++
                        break;
                    case '1':
                        symbolcount--
                        break;
                    case '2':
                        symbolcount--
                        break;
                    case '3':
                        symbolcount--
                        break;
                    case '4':
                        symbolcount--
                        break;
                    case '5':
                        symbolcount--
                        break;
                    case '6':
                        symbolcount--
                        break;
                    case '7':
                        symbolcount--
                        break;
                    case '8':
                        symbolcount--
                        break;
                    case '9':
                        symbolcount--
                        break;
                    case 'C':
                        symbolcount--
                        break;
                    case 'X':
                        symbolcount--
                        break;

                }

            }
            //if multicolored
            if (splitcount > 0) {
                //grey
                bgclr = "#c6bdbd"
                bgclr2 = "#c4c4c4"
                altclr = "#c6bdbd"
            }
            //some super-edge cases
            if (colors > 1 && uniqueColors > 1 && symbolcount != splitcount || props.data.name === "Sphinx of the Guildpact" || props.data.name === "Transguild Courier") {
                //gold
                bgclr = "#d6be73"
                bgclr2 = "#d6be73"
                altclr = "#efd26e"
            }
            // 2/x edge case
            if (colorobject.includes("2/") && uniqueColors === 1) {
                if (seenColors[0]) {
                    bgclr = "#e1dfd9"
                    bgclr2 = "#ebe6d9"
                    altclr = "#e9e8e4"
                }
                if (seenColors[1]) {
                    bgclr = "#84bad9"
                    bgclr2 = "#c5d6eb"
                    altclr = "#0880c3"
                }
                if (seenColors[2]) {
                    bgclr = "#a29d9a"
                    bgclr2 = "#bab7b9"
                    altclr = "#3b3b38"
                }
                if (seenColors[3]) {
                    bgclr = "#f4b09a"
                    bgclr2 = "#eac3ad"
                    altclr = "#aa230e"
                }
                if (seenColors[4]) {
                    bgclr = "#adcebd"
                    bgclr2 = "#c7dece"
                    altclr = "#025434"
                }
            }
            if (props.data.oracle_text && (props.data.oracle_text.includes("any color") || props.data.oracle_text.includes("chosen color")) && props.data.type_one.toLowerCase().includes("land") && props.data.color_identity === "[]") {
                // if (props.data.oracle_text && (props.data.oracle_text.includes("any color") || props.data.oracle_text.includes("chosen color"))&& props.data.type_one.toLowerCase().includes("land")){
                //gold
                bgclr = "#d6be73"
                bgclr2 = "#d6be73"
                altclr = "#efd26e"
            }
            // console.log(props.data.name, colors, uniqueColors, splitcount, symbolcount)
            updateState({
                listBackgroundColor: bgclr,
                listBackgroundColorV2: bgclr2,
                listAltColor: altclr
            })
        }
    }

    function getManaSymbols() {
        let rawMana = ""
        if (props.data.card_faces) rawMana = props.data.card_faces[0].mana_cost
        else rawMana = props.data.mana_cost


        updateState({ manaCostSymbols: mana.replaceSymbols(rawMana) })
    }

    function mouseDownHandler(event) {
        if (event.button === 1) {
            console.log("middle clicked")
            //TODO:: Nav in new tab? 
            // nav("/card/?id=" + props.data.id)
        }
    }

    function setListHover(value) {
        updateState({ listHover: value })
    }

    return (
        <div className="RegularCard">
            {props.isCompact === true ? <div
                className="CardListObjectContainer"
                // style={{backgroundColor:state.listBackgroundColor, boxShadow: '0px 0px 0px 2px ' + state.listAltColor + ' inset'}}
                style={{ backgroundColor: state.listBackgroundColorV2 }}
            ><a

                href={state.url}
                // id="cardList"
                onMouseEnter={() => setListHover(true)}
                onMouseLeave={() => setListHover(false)}

            // onClick={() => nav("/card/?id=" + props.data.id)}
            // onMouseDown={mouseDownHandler}
            >
                    <div className="CardListInfo">
                        <div className="CardListContent" id="cardListLeft" style={{ fontWeight: 'bold' }}>
                            {(state.data !== undefined && state.data.name !== undefined && state.data.layout === "split") ? (props.count > 1 ? props.count + "x " : "") + state.data.name.slice(0, state.maxNameLength).trim() + (state.data.name.length > state.maxNameLength ? "..." : "") : <></>}
                            {(state.data !== undefined && state.data.name !== undefined && state.data.layout !== "split") ? (props.count > 1 ? props.count + "x " : "") + state.data.name.split('/')[0].trim().slice(0, state.maxNameLength).trim() + (state.data.name.split('/')[0].trim().length > state.maxNameLength ? "..." : "") : <></>}
                        </div>
                        <div className="CardListContent" id="cardListRight">
                            {state.manaCostSymbols}
                        </div>
                    </div>
                </a>
                {state.listHover &&
                    <img src={state.imgLink} id="cardList"></img>
                }
            </div>
                : <div
                    className="CardObjectContainer"
                >
                    <a
                        href={state.url}
                    // onClick={() => nav("/card/?id=" + props.data.id)}
                    // onMouseDown={mouseDownHandler}
                    >
                        <img
                            src={state.imgLink}
                            className="CardObjectImage">
                        </img>
                    </a>
                    {(state.data.card_faces && state.data.layout === "transform" || state.data.layout === "modal_dfc") &&
                        <div className="flipBox"
                            onClick={flipArt}>
                            <img src={flipIcon} className="flipIcon" style={{ transform: 'scaleX(' + transformFlipIcon() + ')' }}></img>
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