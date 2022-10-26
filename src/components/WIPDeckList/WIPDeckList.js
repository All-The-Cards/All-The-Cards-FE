// This Component displays a User List View from User .JSON info

import { React, useEffect, useState, useContext } from "react";
import './WIPDeckList.css'
import '../../pages/GlobalStyles.css'
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import CardObject from "../CardObject/CardObject";
import * as utilities from '../../functions/Utilities'
import * as stats from '../../functions/Stats'

const UserObject = (props) => {

    const gc = useContext(GlobalContext)
    const [state, setState] = useState({
        showSideList: true
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }
    useEffect(() => {
        getData()
    }, [props])


    const getData = () =>{
        // console.log("deck:", gc.wipDeck)
        if (gc.wipDeck && !gc.wipDeck.coverCard) {
          gc.setWipDeck((previous) => ({
            ...previous,
            coverCard: {
              image_uris: {
                art_crop: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
              }
            }
          }))
        }
        // updateState({ 

        // })
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
        console.log(item)
        let tempCards = gc.wipDeck.cards
        let index = gc.wipDeck.cards.indexOf(item)
        tempCards.splice(index, 1)
        gc.setWipDeck((previous) => ({
            ...previous,
            cards: tempCards
        }))
      }
      
      const addToDeck = (item) => {
        let tempCards = gc.wipDeck.cards
        tempCards.push(item)
        gc.setWipDeck((previous) => ({
            ...previous,
            cards: tempCards
        }))
    }

    const getCount = (card, cards) => {
      return cards.filter((item) => { return item.name === card.name }).length
    }

    const getMargin = () => {
      if (state.showSideList) {
        return '0px'
      }
      else {
        return '-340px'
      }
    }

    return(
        <>
        {
            gc.isEditing && 
            <div className="DeckListContainer" style={{left: getMargin()}}>
              <div className="DeckListToggle" onClick={() => {
                updateState({
                  showSideList: !state.showSideList
                })
              }}>o</div>
              <Link to="/deckeditor">
                <div className="DeckListCover" 
                  style={{
                    backgroundImage:"url(" + (gc.wipDeck.coverCard && gc.wipDeck.coverCard.image_uris.art_crop)  + ")",
                    // backgroundPosition: "center",
                    // backgroundRepeat: "no-repeat",
                    // backgroundSize: "cover"
                  }}>
                  <div className="DeckTitle DeckListTitle">
                    {gc.wipDeck.title.length < 1 && "New Deck"}
                    {gc.wipDeck.title.substring(0,16).trim()}{gc.wipDeck.title.length > 16 && "..."}
                  </div>
                  <div className="DeckListFormat">{utilities.getProperFormatName(gc.wipDeck.formatTag)}</div>
                  <div className="DeckListSize">{gc.wipDeck.cards.length} cards</div>
                </div>
              </Link>
                {
                    gc.wipDeck.cards.length > 0 &&
                    <div>
                    <div className="wipDeckListGroupTitle">
                    </div>
                    <div className="wipDeckListGroupTitle">
                    Spells - {gc.wipDeck.cards.length - stats.getDeckStats(gc.wipDeck.cards).land_count}
                    </div>
                      { makeUniqueDeck(gc.wipDeck.cards)
                      .filter((item) => { 
                        console.log(item)
                        return !item.type_one.toLowerCase().includes("land")
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
                        console.log(item)
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
        }
        </>
    )
}

export default UserObject