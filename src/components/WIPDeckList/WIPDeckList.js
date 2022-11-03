// This Component displays a User List View from User .JSON info

import { React, useEffect, useState, useContext } from "react";
import './WIPDeckList.css'
import '../../pages/GlobalStyles.css'
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import CardObject from "../CardObject/CardObject";
import * as utilities from '../../functions/Utilities'
import * as stats from '../../functions/Stats'
import { saveToLocalStorage } from '../../functions/Utilities';

const WIPDeckList = (props) => {

    const gc = useContext(GlobalContext)
    const [state, setState] = useState({
        showSideList: true,
        showCommanderDropdown: true,
        validCommanders: ""
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }
    useEffect(() => {
        getData()
    }, [props, gc.wipDeck])


    const getData = () =>{
        // console.log("deck:", gc.wipDeck)
        if (gc.wipDeck && !gc.wipDeck.coverCard) {
          gc.setWipDeck((previous) => ({
            ...previous,
            coverCard: {
              image_uris: {
                art_crop: ""
              }
            }
          }))
          utilities.saveToLocalStorage("wipDeck", gc.wipDeck)

        }
        // updateState({ 

        // })
        updateState({validCommanders: getValidCommanders()})
    }
    
    const sortByCMC = (a, b) => {
        if (a.cmc > b.cmc) {
          return 1
        }
        if (a.cmc < b.cmc) {
          return -1
        }
        return 0
      }
      
      const sortByLand = (a, b) => {
        if (a.type_one.toLowerCase().includes("Land".toLowerCase())) {
          return 1
        }
        else {
          return -1
        }
      }
      
      const sortByName = (a, b) => {
        if (a.name >= b.name) {
          return 1
        }
        else {
          return -1
        }
      }

      const makeUniqueDeck = (deck) => {
        let uniqueDeck = deck

        let uniqueRes = []
        let uniqueNames = []
        uniqueRes = deck.filter((item) => {
          let duplicate = uniqueNames.includes(item.name)
          if (!duplicate) {
            uniqueNames.push(item.name)
            return true;
          }
          return false;
        })
        uniqueDeck = uniqueRes

        return uniqueDeck
      }

      const removeFromDeck = (item) => {
        // console.log(item)
        let tempCards = gc.wipDeck.cards
        let index = gc.wipDeck.cards.indexOf(item)
        tempCards.splice(index, 1)
        gc.setWipDeck((previous) => ({
            ...previous,
            cards: tempCards
        }))
        utilities.saveToLocalStorage("wipDeck", gc.wipDeck)

      }
      
      const addToDeck = (item) => {
        let tempCards = gc.wipDeck.cards
        tempCards.push(item)
        gc.setWipDeck((previous) => ({
            ...previous,
            cards: tempCards
        }))
        utilities.saveToLocalStorage("wipDeck", gc.wipDeck)
    }

    const getCount = (card, cards) => {
      return cards.filter((item) => { return item.name === card.name }).length
    }

    const getMargin = () => {
      if (state.showSideList) {
        return '0px'
      }
      else {
        return '-360px'
      }
    }

    const updateWipDeck = (objectToUpdate) => {
      gc.setWipDeck((previous) => ({
        ...previous,
        ...objectToUpdate
      }))
      saveToLocalStorage("wipDeck", gc.wipDeck)
    }

    const getValidCommanders = () => {
      // console.log(gc.wipDeck.commanderSlot)
      let results = makeUniqueDeck(gc.wipDeck.cards)
        .filter((item) => { 
          // return item === gc.wipDeck.commanderSlot
          return item.type_one.toLowerCase().includes("legendary") && item.type_one.toLowerCase().includes("creature")
        })
        .sort(sortByName).map((item, i) => {
        // console.log(item)
        return(<option key={i} value={JSON.stringify(item)}>
          { item.name }
        </option>)
        })
        // console.log(results)
        if (results.length > 0) {
          results.unshift(<option key={-1} value={"SET"}>
          Choose a commander...
        </option>)
          results.push(<option key={999999} value={"REMOVE"}>
            ***Remove Commander***
          </option>)
        }
        else {
          results.push(<option key={999999} value={"ADD"}>
            Add a valid commander...
          </option>)
        }

        let commanders = makeUniqueDeck(gc.wipDeck.cards)
        .filter((item) => { 
          // return item === gc.wipDeck.commanderSlot
          return item.type_one.toLowerCase().includes("legendary") && item.type_one.toLowerCase().includes("creature")
        }).sort(sortByName)

      //   if (commanders.length > 1 && (JSON.stringify(gc.wipDeck.commanderSlot) == "{}" || JSON.stringify(gc.wipDeck.commanderSlot) == JSON.stringify({"image_uris":{"art_crop":""},"name":""}) ||JSON.stringify(gc.wipDeck.commanderSlot) == JSON.stringify({"name":"","image_uris":{"art_crop":""}}) || JSON.stringify(gc.wipDeck.commanderSlot) == JSON.stringify({"name":""}))) {
      //     updateWipDeck({
      //       commanderSlot: commanders[0],
      //       coverCard: commanders[0]
      //     })
      //   }

      //   if (commanders.length > 1 && gc.wipDeck.commanderSlot == undefined  && commanders[0] !== <option key={999999} value={"REMOVE"}>
      //   ***Remove Commander***
      // </option>) {
      //     updateWipDeck({
      //       commanderSlot: commanders[0],
      //       coverCard: commanders[0]
      //     })
      //   }

        return results
    }

    const toggleCommanderDropdown = () => {
      updateState({showCommanderDropdown: !state.showCommanderDropdown})
    }

    const setCommander = (event) => {
      let otherCommanders = []
      if(gc.wipDeck.cards.length > 0) {

        otherCommanders = makeUniqueDeck(gc.wipDeck.cards)
        .filter((item) => { 
          // return item === gc.wipDeck.commanderSlot
          if (gc.wipDeck.commanderSlot) return item.type_one.toLowerCase().includes("legendary") && item.type_one.toLowerCase().includes("creature") && item.name !== gc.wipDeck.commanderSlot.name
          else {
            return item.type_one.toLowerCase().includes("legendary") && item.type_one.toLowerCase().includes("creature")
          }
        })
      }

      if (otherCommanders.length === 0){
        otherCommanders.push({
            name: ""
        })
      }

      if (event.target.value === "REMOVE"){
        // console.log("COMMANDER TO REMOVE: ", gc.wipDeck.commanderSlot)
        let tempCards = gc.wipDeck.cards
        let index = gc.wipDeck.cards.indexOf(gc.wipDeck.commanderSlot)
        tempCards.splice(index, 1)
        gc.setWipDeck((previous) => ({
            ...previous,
            cards: tempCards
        }))
        utilities.saveToLocalStorage("wipDeck", gc.wipDeck)

        // console.log(otherCommanders[0])
        updateWipDeck({ 
          commanderSlot: otherCommanders[0]
        }) 
      }
      else if (event.target.value === "ADD"){

      }
      else if (event.target.value === "SET"){

      }
      else {
        // console.log("Changed commander")
        updateWipDeck({ 
          commanderSlot: JSON.parse(event.target.value),
          coverCard: JSON.parse(event.target.value)
        }) 
      }
    }

    return(
        <>
        {
            gc.isEditing && 
            <div>
              <div className="DeckListToggle" onClick={() => {
                updateState({
                  showSideList: !state.showSideList
                })
              }}> 
                <div style={{marginTop:'5px', color: 'rgba(0,0,0,.5)'}}>{state.showSideList ? "<" : ">"}</div>
              </div>
            <div className="DeckListContainer" style={{left: getMargin()}}>
              <Link to="/deckeditor">
                <div className="DeckListCover" 
                  style={{
                    backgroundImage:"url(" + (gc.wipDeck.coverCard && gc.wipDeck.coverCard.image_uris && gc.wipDeck.coverCard.image_uris.art_crop)  + ")",
                    // backgroundPosition: "center",
                    // backgroundRepeat: "no-repeat",
                    // backgroundSize: "cover"
                  }}>
                  <div className="DeckTitle DeckListTitle">
                    {gc.wipDeck.title.length < 1 && "New Deck"}
                    {gc.wipDeck.title.substring(0,16).trim()}{gc.wipDeck.title.length > 16 && "..."}
                  </div>
                  <div className="DeckListFormat">{utilities.getProperFormatName(gc.wipDeck.formatTag)}</div>
                  <div className="DeckListSize">{gc.wipDeck.cards.length} card{gc.wipDeck.cards.length != 1 && "s"}</div>
                </div>
              </Link>
                {
                    gc.wipDeck.cards.length > 0 &&
                    <div>
                    { 
                      gc.wipDeck && gc.wipDeck.formatTag === "commander" &&
                      <div>
                        <div className="wipDeckListGroupTitle">
                          Commander
                          <div className="DeckListSmallIcon"
                            style={{top:"0px", left:'10px', marginBottom:'4px'}}
                            onClick={() => {
                              toggleCommanderDropdown()
                            }}>
                            {state.showCommanderDropdown ? "-" : "+"}
                          </div>
                        </div>
                        {
                          gc.wipDeck && 
                          <div>
                            {
                              state.showCommanderDropdown &&
                              <select 
                                style={{marginBottom:"10px", width: "90%"}}
                                value={JSON.stringify(gc.wipDeck.commanderSlot)} onChange={(event) => { 
                                  setCommander(event)
                                }}>
                                { state.validCommanders }
                              </select>
                            }
                          </div>
                        }
                        { makeUniqueDeck(gc.wipDeck.cards)
                        .filter((item) => { 
                          let iname = item.name
                          // console.log(gc.wipDeck)
                          // return item === gc.wipDeck.commanderSlot
                          if(gc.wipDeck.commanderSlot) return iname === gc.wipDeck.commanderSlot.name
                        })
                        .sort(sortByName).map((item, i) => 
                        <div key={i} className="DeckListCard" style={{userSelect:"none", marginLeft:"-24px"}}>
                            <div className="CardListObject" style={{display:"inline-block"}}
                              >
                            <CardObject data={item} isCompact={true} 
                            count={getCount(item, gc.wipDeck.cards)}/>
                            </div>
                          {/* <div className="DeckListSmallIcon"
                          title="Set as cover art"
                            onClick={() => {
                              updateWipDeck({
                                coverCard: item
                              })
                            
                            }}>
                            [o]
                          </div> */}
                        </div>)
                      }
                      </div>
                    }
                    <div className="wipDeckListGroupTitle">
                    Spells - {gc.wipDeck.cards.filter((item) => {
                      return item.name !== gc.wipDeck.commanderSlot.name
                    }).length- stats.getDeckStats(gc.wipDeck.cards).land_count}
                    </div>
                      { makeUniqueDeck(gc.wipDeck.cards)
                      .filter((item) => { 
                        // console.log(item)
                        if (gc.wipDeck.commanderSlot) return !item.type_one.toLowerCase().includes("land") && item.name !== gc.wipDeck.commanderSlot.name
                        else return !item.type_one.toLowerCase().includes("land")
                      })
                      .sort(sortByName).sort(sortByCMC).map((item, i) => 
                      <div key={i} className="DeckListCard" style={{userSelect:"none"}}>
                          <div className="CardListObject" style={{display:"inline-block"}}
                            onClick={() => {
                              removeFromDeck(item)
                            }}>
                          <CardObject data={item} isCompact={true} 
                          count={getCount(item, gc.wipDeck.cards)}/>
                          </div>
                          <div className="DeckListSmallIcon"
                            onClick={() => {
                              addToDeck(item)
                            }}>
                            +
                          </div>
                      </div>)
                    }  
                    <div className="wipDeckListGroupTitle">
                    Lands - {stats.getDeckStats(gc.wipDeck.cards).land_count}
                    </div>
                    { makeUniqueDeck(gc.wipDeck.cards)
                      .filter((item) => { 
                        // console.log(item)
                        return item.type_one.toLowerCase().includes("land")
                      })
                      .sort(sortByName).map((item, i) => 
                      <div key={i} className="DeckListCard" style={{userSelect:"none"}}>
                          <div className="CardListObject" style={{display:"inline-block"}}
                            onClick={() => {
                              removeFromDeck(item)
                            }}>
                          <CardObject data={item} isCompact={true} 
                          count={getCount(item, gc.wipDeck.cards)}/>
                          </div>
                          <div className="DeckListSmallIcon"
                            onClick={() => {
                              addToDeck(item)
                            }}>
                            +
                          </div>
                      </div>)
                    }
                    </div>
                }
            </div>
            </div>
        }
        </>
    )
}

export default WIPDeckList