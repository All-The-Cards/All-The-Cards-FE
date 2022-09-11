import { React, useState, useEffect, useContext} from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject';
import * as server from '../functions/ServerTalk.js';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { GlobalContext } from "../context/GlobalContext";
import './SearchResults.css'
import './GlobalStyles.css'

const SearchResults = (props) => {


  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);
  const {searchQuery, setSearchQuery} = useContext(GlobalContext);
  const {searchType, setSearchType} = useContext(GlobalContext);

    const [state, setState] = useState({
      cardResults: [],
      deckResults: [],
      userResults: [],
      cardResultsFound: -1,
      deckResultsFound: -1,
      userResultsFound: -1,

      cardResultIndex: 0,
      deckResultIndex: 0,
      userResultIndex: 0,

      showResultAmountCards: 12,
      showResultAmountDecks: 4,
      showResultAmountUsers: 20,

      advSearch: {
        artist: "",
        cmc: "",
        color_identity: "",
        colors: "",
        flavor_text: "",
        lang: "",
        legalities: "",
        name: "",
        oracle_text: "",
        power: "",
        rarity: "",
        set_name: "",
        set_shorthand: "",
        subtype_: "",
        toughness: "",
        type_: "",
      }
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }
    const urlTag = useSearchParams()[0].toString()
    const nav = useNavigate()

    //on page load, or whenever the /search/?query= changes
    useEffect(() => {
      document.title = "Search Results"

      setSearchBar(props.hasSearchBar)

      //console.log(query)
      updateState({ 
        cardResults: [],
        deckResults: [],
        userResults: [],
        cardResultsFound: -1,
        deckResultsFound: -1,
        userResultsFound: -1,
      })

      let query = searchQuery
      //search if query not empty
      query = query.trim()
      if (searchType === "ADV") {
        search(query, 'card/adv')
      }
      if(query !== "" && searchType === "DEF") {
        // if (searchType === "ADV") {
        //   search(query, 'card/adv')
        // }
        // else {
          search(query, 'card')
          search(query, 'deck')
          //search(query, 'user')
        // }
      }
      else {
        updateState({ 
          cardResults: [],
          deckResults: [],
          userResults: [],
          cardResultsFound: 0,
          deckResultsFound: 0,
          userResultsFound: 0,
        })
      }
    }, [urlTag])

  const search = (query, type) => {
    
    // console.log("sending search type: " + searchType)
    if (searchType === "ADV") {
      query += "?"
      // console.log(query, state.advSearch)
      for (let [key, value] of Object.entries(state.advSearch) ) {
        if (value) {
          query += key + "=" + value + "&"
        }
      }
      // console.log('api request: ' + query)
      // console.log('not sending, backend not setup yet')

    }
    //reset search page
    updateState({
      
      cardResultIndex: 0,
      deckResultIndex: 0,
      userResultIndex: 0,

    })

    let showAll = false
    //if the query has "!a", set showall to true
    if (query.includes("%21a") || query.includes("!a")) {
      query = query.replaceAll("%21a", '')
      query = query.replaceAll("%20%21a", '')
      query = query.replaceAll(" !a", '')
      query = query.replaceAll("!a", '')
      query = query.replaceAll("+", ' ')
      query = query.trim()
      showAll = true
    }
    //fix formatting to what server expects
    query = query.replaceAll('+', '%20')
    query = "/api/search/" + type + "/query=" + query
    //if query is empty, don't send
    if (query.trim() === "/api/search/" + type + "/query=" ) {
      console.log('empty')
      return
    }

    console.log('api request: ', query)
    console.log('data: ', state.advSearch)
    server.post(query).then(response => {
      let res = response
      // console.log(res)

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
            cardResults: res,
            cardResultsFound: res.length,
          })

          break
        case 'card/adv':
          updateState({          
            cardResults: res,
            cardResultsFound: res.length,
          })

          break
        case 'deck':
          updateState({          
            deckResults: res,
            deckResultsFound: res.length,
          })

          break
        case 'user':
          updateState({          
            userResults: res,
            userResultsFound: res.length,
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

  const setAdvType = (event) =>{
    updateState({
      advType: event.target.value
    })
  }

  return (
    <div className="Container">
      {searchType === "ADV" && <div>
    ADVANCED:
    <br></br>
    Name: 
    <input
      value={state.advSearch.name}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,name: e.target.value}})}}
    /><br></br>
    Text: 
    <input
      value={state.advSearch.oracle_text}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,oracle_text: e.target.value}})}}
    /><br></br>
    CMC: 
    <input
      value={state.advSearch.cmc}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,cmc: e.target.value}})}}
    /><br></br>
    Type: 
    <input
      value={state.advSearch.type_}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,type_: e.target.value}})}}
    /><br></br>
    Subtype: 
    <input
      value={state.advSearch.subtype_}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,subtype_: e.target.value}})}}
    /><br></br>
    Colors: 
    <input
      value={state.advSearch.colors}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,colors: e.target.value}})}}
    /><br></br>
    Color Identity: 
    <input
      value={state.advSearch.color_identity}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,color_identity: e.target.value}})}}
    /><br></br>
    Power: 
    <input
      value={state.advSearch.power}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,power: e.target.value}})}}
    /><br></br>
    Toughness: 
    <input
      value={state.advSearch.toughness}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,toughness: e.target.value}})}}
    /><br></br>
    Legalities: 
    <input
      value={state.advSearch.legalities}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,legalities: e.target.value}})}}
    /><br></br>
    Rarity: 
    <input
      value={state.advSearch.rarity}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,rarity: e.target.value}})}}
    /><br></br>
    {/* Set: 
    <input
      value={state.advSearch.set_name}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,set_name: e.target.value}})}}
    /><br></br> */}
    Set ID: 
    <input
      value={state.advSearch.set_shorthand}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,set_shorthand: e.target.value}})}}
    /><br></br>
    Artist: 
    <input
      value={state.advSearch.artist}
      onChange={(e) => {updateState({ advSearch: { ...state.advSearch, artist: e.target.value} })}}
    /><br></br>
    Flavor Text: 
    <input
      value={state.advSearch.flavor_text}
      onChange={(e) => {updateState({advSearch: {...state.advSearch,flavor_text: e.target.value}})}}
    /><br></br>
    <button className='FancyButton' onClick={() => { 
            nav("/search?key=" + Math.floor((Math.random() * 1000000000)).toString("16"))
          }}>Search</button>
    </div>
      }
      {/* if there are no results yet, show searching */}
      {/* { (state.cardResultsFound < 0 || state.deckResultsFound < 0 || state.userResultsFound < 0) &&  */}
      { (state.cardResultsFound < 0 || state.deckResultsFound < 0 ) && 
        <div className="HeaderText" style={{textAlign:'center'}}>
          Searching...
          {/* <img src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif"/> */}
        </div>
      }
      {/* { (state.cardResultsFound == 0 && state.deckResultsFound == 0 && state.userResultsFound == 0) && */}
      { (state.cardResultsFound == 0 && state.deckResultsFound == 0) &&
        <div className="HeaderText" style={{textAlign:'center'}}>
        No results found :(
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
        <div className="ResultsContainer">
        { state.cardResults.slice(state.cardResultIndex, state.cardResultIndex + state.showResultAmountCards).map((item, i) => <CardObject data={item} key={i}/>) }
        </div>
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
              if (state.cardResultIndex < state.cardResults.length - state.showResultAmountCards) {
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
              if (state.deckResultIndex < state.deckResults.length - state.showResultAmountDecks) {
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
              if (state.userResultIndex < state.userResults.length - state.showResultAmountUsers) {
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