import { React, useState, useEffect, useContext} from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams } from 'react-router-dom';

import { GlobalContext } from "../context/GlobalContext";
import './SearchResults.css'
import './GlobalStyles.css'

const SearchResults = (props) => {


  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

    const [state, setState] = useState({
      cardResults: [],
      deckResults: [],
      userResults: [],

      cardResultIndex: 0,
      deckResultIndex: 0,
      userResultIndex: 0,

      showResultAmountCards: 12,
      showResultAmountDecks: 4,
      showResultAmountUsers: 20
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }

    //get first search param
    const query = useSearchParams()[0].toString()

    //on page load, or whenever the /search/?query= changes
    useEffect(() => {

        setSearchBar(props.hasSearchBar)

        //console.log(query)
        updateState({ 
          cardResults: [],
          deckResults: [],
          userResults: [],
        })
        //search if query not empty
        if(query.trim() !== "query=") {
          let queryTrimmed = query.replaceAll("query=", '')
          search(queryTrimmed, 'card')
          search(queryTrimmed, 'deck')
          //search(queryTrimmed, 'user')
        }
    }, [query])


  const search = (query, type) => {
    //reset search page
    updateState({
      
      cardResultIndex: 0,
      deckResultIndex: 0,
      userResultIndex: 0,

    })
    let showAll = false
    //if the query has "!a", set showall to true
    if (query.includes("%21a")) {
      query = query.replaceAll("%21a", '')
      query = query.replaceAll("+", ' ')
      query = query.trim()
      showAll = true
    }
    //fix formatting to what server expects
    query = query.replaceAll('+', '%20')
    query = "/api/search/" + type + "/query=" + query
    //if query is empty, don't send
    if (query.trim() === "/api/search/" + type + "/query=" ) {
      return
    }

    server.post(query).then(response => {
      let res = response

      //sort by language
      res = res.sort(sortByLanguage)
      //sort by frame effects
      res = res.sort(sortByFrameEffects)
      //sort by border
      res = res.sort(sortByBorderColor)
      //sort by non-promo first
      res = res.sort(sortByNonPromo)
      //sort by release date
      res = res.sort(sortByFrameYear)
      //sort results alphabetically
      res = res.sort(sortByName)

      //find duplicates, omit from appearing
      if (!showAll) {
        let uniqueNames = []
        let uniqueRes = res.filter((item) => {
          let duplicate = uniqueNames.includes(item.name)
          if (!duplicate) {
            uniqueNames.push(item.name)
            return true;
          }
          return false;
        })
        res = uniqueRes
      }

      //remove invalid card types for deckbuilding
      let invalidTypes = ['vanguard', 'token', 'memorabilia', 'planar', 'double_faced_token', 'funny']
      let realCardRes = res.filter((item) => {
        return !invalidTypes.includes(item.set_type) && !invalidTypes.includes(item.layout)
      })

      res = realCardRes

      //remove some technically-duplicate cards
      let noArenaRes= res.filter((item) => {
        return !item.name.includes("A-")
      })

      res = noArenaRes

      switch(type){
        case 'card':
          updateState({          
            cardResults: res
          })

          break
        case 'deck':
          updateState({          
            deckResults: res
          })

          break
        case 'user':
          updateState({          
            userResults: res
          })
          break
      }
      

    })

  }

  const sortByName = (a, b) => {
    if (a.name >= b.name) {
      return 1
    }
    else {
      return -1
    }
  }
  
  const sortByFrameYear = (a, b) => {
    if (parseInt(a.frame) <= parseInt(b.frame)) {
      return 1
    }
    else {
      return -1
    }
  }

  const sortByNonPromo = (a, b) => {
    if (a.promo >= b.promo) {
      return 1
    }
    else {
      return -1
    }
  }

  const sortByLanguage = (a, b) => {
    if (a.lang === "en") {
      return 1
    }
    else {
      return -1
    }
  }  
  
  const sortByBorderColor = (a, b) => {
    if (a.border_color !== "black") {
      return 1
    }
    else {
      return -1
    }
  }
  
  const sortByFrameEffects = (a, b) => {
    if (a.frame_effects === null) {
      return 1
    }
    else {
      return -1
    }
  }



  return (
    <div className="Container">
      
      {/* if there are no results yet, show searching */}
      { (state.cardResults.length < 1 && state.deckResults.length < 1) && 
        <div className="HeaderText" style={{textAlign:'center'}}>
          Searching...
          {/* <img src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif"/> */}
        </div>
      }

      {/* if there are any card results, display them */}
      {state.cardResults.length > 0 && 
      <div className="Results">
        <div style={{display:'block', textAlign:'left'}}>
          <header className="HeaderText">Cards</header>
          Cards found: {state.cardResults.length} | Showing: {state.cardResultIndex + 1} - {state.showResultAmountCards + state.cardResultIndex}
        </div>
        <br></br>
        { state.cardResults.slice(state.cardResultIndex, state.cardResultIndex + state.showResultAmountCards).map((item, i) => <span><CardObject data={item} key={i}/>{(i + 1) % 4 === 0 && <br></br>}</span>) }
        <div>
          <button 
            className="FancyButton"
            id="alt"
            onClick={() => { 
              if (state.cardResultIndex >= state.showResultAmountCards) {
                updateState({
                  cardResultIndex: state.cardResultIndex - state.showResultAmountCards,
                })
              }
            }
          }>
            Previous {state.showResultAmountCards}
          </button>

          <button 
            className="FancyButton"
            onClick={() => { 
              if (state.cardResultIndex <= state.cardResults.length - state.showResultAmountCards) {
                updateState({
                  cardResultIndex: state.cardResultIndex + state.showResultAmountCards,
                })
              }
            }
          }>
            Next {state.showResultAmountCards}
          </button>
        </div>
      </div>
      }

      <br></br>
      
      {/* if there are any deck results, display them */}
      {state.deckResults.length > 0 && 
      <div className="Results">
        <div style={{display:'block', textAlign:'left'}}>
          <header className="HeaderText">Decks</header>
          Decks found: {state.deckResults.length} | Showing: {state.deckResultIndex + 1} - {state.showResultAmountDecks + state.deckResultIndex}
        </div>
        <br></br>
        { state.deckResults.slice(state.deckResultIndex, state.deckResultIndex + state.showResultAmountDecks).map((item, i) => <DeckTileObject data={item} key={i}/>) }
        <div>
          <button 
            className="FancyButton"
            id="alt"
            onClick={() => { 
              if (state.deckResultIndex >= state.showResultAmountDecks) {
                updateState({
                  deckResultIndex: state.deckResultIndex - state.showResultAmountDecks,
                })
              }
            }
          }>
            Previous {state.showResultAmountDecks}
          </button>

          <button 
            className="FancyButton"
            onClick={() => { 
              if (state.deckResultIndex <= state.deckResults.length - state.showResultAmountDecks) {
                updateState({
                  deckResultIndex: state.deckResultIndex + state.showResultAmountDecks,
                })
              }
            }
          }>
            Next {state.showResultAmountDecks}
          </button>
        </div>
      </div>
      }

      <br></br>
      
      {/* if there are any user results, display them */}
      {state.userResults.length > 0 && 
      <div className="Results">
        <header className="HeaderText">Users</header>
        {state.userResults.slice(state.userResultIndex, state.userResultIndex + state.showResultAmountUsers).map((item, i) => <div key={i}>{item.name}</div>) }
        <div>
          <button 
            className="FancyButton"
            id="alt"
            onClick={() => { 
              if (state.userResultIndex >= state.showResultAmountUsers) {
                updateState({
                  userResultIndex: state.userResultIndex - state.showResultAmountUsers,
                })
              }
            }
          }>
            Previous {state.showResultAmountUsers}
          </button>

          <button 
            className="FancyButton"
            onClick={() => { 
              if (state.userResultIndex <= state.userResults.length - state.showResultAmountUsers) {
                updateState({
                  userResultIndex: state.userResultIndex + state.showResultAmountUsers,
                })
              }
            }
          }>
            Next {state.showResultAmountUsers}
          </button>
        </div>
      </div>
    }
    </div>
  );

};

export default SearchResults;