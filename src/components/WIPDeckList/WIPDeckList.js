// This Component displays a User List View from User .JSON info

import { React, useEffect, useState, useContext } from "react";
import './WIPDeckList.css'
import '../../pages/GlobalStyles.css'
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import CardObject from "../CardObject/CardObject";

const UserObject = (props) => {

    const gc = useContext(GlobalContext)
    const [state, setState] = useState({
        
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }
    useEffect(() => {
        gc.setShowActiveDeckList(true)
        getData()
    }, [props])


    const getData = () =>{
        console.log("deck:", gc.wipDeck)
        // updateState({ 

        // })
    }
    
    const sortByCMC = (a, b) => {
        if (a.cmc >= b.cmc) {
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

    return(
        <>
        {
            gc.showActiveDeckList && 
            <div className="DeckListContainer">
                <div className="DeckTitle" style={{marginBottom:"10px"}}>{gc.wipDeck.title}</div>
                {
                    makeUniqueDeck(gc.wipDeck.cards).sort(sortByCMC).map((item, i) => 
                    <div key={i} className="DeckListCard">
                        <div className="CardListObject" style={{display:"inline-block"}}>
                        <CardObject data={item} isCompact={true} count={gc.wipDeck.cards.filter((f) => {
                            return f.name === item.name
                        }).length}/>
                        </div>
                        {/* <div className="DeckListSmallIcon"><div style={{marginLeft:'5px'}}>+</div></div>
                        <div className="DeckListSmallIcon"><div style={{marginLeft:'6px'}}>-</div></div> */}
                    </div>)
                }
            </div>
        }
        </>
    )
}

export default UserObject