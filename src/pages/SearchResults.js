import { React, useState, useEffect, useContext} from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject';
import * as server from '../functions/ServerTalk.js';
import * as mana from '../components/TextToMana/TextToMana.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import { GlobalContext } from "../context/GlobalContext";
import './SearchResults.css'
import './GlobalStyles.css'
import UserObject from '../components/UserObject/UserObject.js';




const SearchResults = (props) => {

  const gc = useContext(GlobalContext)

  
    const [state, setState] = useState({

      cardResults: [],
      deckResults: [],
      userResults: [],
      cardResultsOriginal: [],
      cardResultsFiltered: [],
      cardResultsFound: -1,
      deckResultsFound: -1,
      userResultsFound: -1,

      cardResultIndex: 0,
      deckResultIndex: 0,
      userResultIndex: 0,

      showResultAmountCards: 12,
      showResultAmountDecks: 4,
      showResultAmountUsers: 12,

      advSearch: {
        artist: "",
        cmc: "",
        color_identity: [false, false, false, false, false, false],
        colors: [false, false, false, false, false, false],
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
      },

      filters: {
        rarity: "",
        type: "",
        legality: "",
        color_identity: [false, false, false, false, false, false]
      },

      sortType: "",

      advancedContainerDisplay: 'none',
      resultsDisplayMode: 'cards',
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
      gc.setSearchBar(props.hasSearchBar)
      gc.setDevMode(process.env.NODE_ENV === 'development' ? true : false)
      // gc.setDevMode(false)

      

      //url query - first result is for advanced query, second is query string
      let tagSplit = ["",""]
      //if urlTag exists
      if (urlTag) {
        tagSplit = urlTag.replaceAll("%3F", "").split("%2F")
      }
      let queryString = ""

      //if advanced search
      if (tagSplit[0] === "adv=true"){
        gc.setSearchType("ADV")
        queryString = "name=" + tagSplit[1]
        updateState({ advancedContainerDisplay: 'block'})
      }
      //otherwise default
      else {
        gc.setSearchType("DEF")
        queryString = tagSplit[1]
        queryString = queryString.replace("query%3D", "")
        updateState({ advancedContainerDisplay: 'none'})
      }

      //reset results
      updateState({ 
        cardResults: [],
        cardResultsOriginal: [],
        deckResults: [],
        userResults: [],
        cardResultsFound: -1,
        deckResultsFound: -1,
        userResultsFound: -1,
        filters: {
          legality: "",
          rarity: "",
          type: "",
          color_identity: [false,false,false,false,false,false]
        }
      })

      let query = queryString
      query = query.trim()
      query = query.replaceAll("%3D", "=")
      //do advanced search or...
      if (tagSplit[0] === "adv=true" && query !== "name=" && query !== "name=query=" && query !== "name=undefined") {
          search(query, 'card/adv')
          updateState({ 
            deckResults: [],
            userResults: [],
            deckResultsFound: 0,
            userResultsFound: 0,
          })
      }
      //if query not empty, do regular search
      else if(tagSplit[0] === "adv=false") {
          search(query, 'card')
          search(query, 'deck')
          search(query, 'user')
      }
      else {
        //query must have been invalid
        updateState({ 
          cardResults: [],
          cardResultsOriginal: [],
          deckResults: [],
          userResults: [],
          cardResultsFound: 0,
          deckResultsFound: 0,
          userResultsFound: 0,
        })
      }

    }, [urlTag])

  const search = (query, type) => {
    query = query.replace("%3D", "=")

    //reset search page so that "Searching..." displays
    updateState({
      cardResultIndex: 0,
      deckResultIndex: 0,
      userResultIndex: 0,

    })

    let showAll = false
    //if the query has "!a", set showall to true - for results only
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
    if (query.trim() === "/api/search/" + type + "/query=" || query.trim() === "/api/search/" + type + "/query=?"  ) {
      console.log('empty')
      updateState({ cardResultsFound: 0 })
      return
    }

    //fix advanced from url
    query = query.replace("query=name=query=", "query=?")
    query = query.replace("%3D", '=')
    
    server.post(query).then(response => {
      let res = response
      // console.log(res)
      console.log("Searching for... " + query)
      console.log("Found " + res.length + " " + type + " results")
      //if a card search, do some filtering
      if (type === 'card' || type ==='card/adv'){
        let englishCards = res.filter((item) => {
          return item.lang === "en"
        })
        res = englishCards

        //sort by release date
        res = res.sort(sortByRelease)

        //get cards that are "real" cards, buildable in a deck
        let legalCards = res.filter((item) => {
          return !Object.values(item.legalities).every(value => value === "not_legal")
        })
        res = legalCards

        if (!showAll) {
          //remove art-types 
          const artTypes = ["borderless", "gold", "inverted", "showcase", "extendedart", "etched"]
          let regularCards = res.filter((item) => {
            return !artTypes.some(el => { if (item.border_color) return item.border_color.includes(el) }) 
              && !artTypes.some(el => { if (item.frame_effects) return item.frame_effects.includes(el) })
              && !artTypes.some(el => { if (item.finishes) return item.finishes.includes(el) })
              && item.promo === "false"
              && item.full_art === "false" 
              // && item.digital === "false"
              && item.games !== "['arena']"
              && item.set_shorthand !== "sld"
              && item.set_type !== "masterpiece"
              && item.finishes !== "['foil']"
              && item.set_type !== "spellbook"
          })
          res = regularCards

          //find duplicates, omit from appearing
          let uniqueRes = []
          let uniqueNames = []
          uniqueRes = res.filter((item) => {
            let duplicate = uniqueNames.includes(item.name)
            if (!duplicate) {
              uniqueNames.push(item.name)
              return true;
            }
            return false;
          })
          res = uniqueRes
        }


        // this is deprecated by the above function
        // //remove invalid card types for deckbuilding
        // let invalidTypes = ['vanguard', 'token', 'planar', 'double_faced_token', 'funny', 'art_series']
        // // let invalidTypes = ['vanguard', 'token', 'memorabilia', 'planar', 'double_faced_token', 'funny']
        // let realCardRes = res.filter((item) => {
        //   return !invalidTypes.includes(item.set_type) && !invalidTypes.includes(item.layout)
        // })
        // res = realCardRes

        //remove some technically-duplicate cards
        let noArenaRes= res.filter((item) => {
          return !item.name.includes("A-")
        })
        res = noArenaRes

      }
      //sort results alphabetically
      res = res.sort(sortByName)
      //set the results for whichever type of search
      switch(type){
        case 'card':
          updateState({          
            cardResults: res,
            cardResultsOriginal: res,
            cardResultsFound: res.length,
          })

          break
        case 'card/adv':
          updateState({          
            cardResults: res,
            cardResultsOriginal: res,
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
  const sortByName2 = (a, b) => {
    if (a.name <= b.name) {
      return 1
    }
    else {
      return -1
    }
  }
  const sortByCMC = (a, b) => {
    if (a.cmc >= b.cmc) {
      return 1
    }
    else {
      return -1
    }
  }
  const sortByCMC2 = (a, b) => {
    if (a.cmc <= b.cmc) {
      return 1
    }
    else {
      return -1
    }
  }
  const sortByType = (a, b) => {
    let typeA = ""
    let typeB = ""
    if (a.type_one) typeA = a.type_one + a.type_two
    else if (a.card_faces) typeA = a.card_faces[0].type_one + a.card_faces[0].type_two

    if (b.type_one) typeA = b.type_one + b.type_two
    else if (b.card_faces) typeA = b.card_faces[0].type_one + b.card_faces[0].type_two



    if (typeA >= typeB) {
      return 1
    }
    else {
      return -1
    }
  }
  const sortBySet = (a, b) => {
    if (a.set_name >= b.set_name) {
      return 1
    }
    else {
      return -1
    }
  }
  const sortByRelease = (a, b) => {
    let aDate = new Date(a.released_at)
    let bDate = new Date(b.released_at)
    if (aDate >= bDate) {
      return -1
    }
    else {
      return 1
    }
  }

  //toggle query type
  const toggleType = () => {
    if (gc.searchType === "ADV") {
        gc.setSearchType("DEF")
        updateState({ advancedContainerDisplay: 'none'})
    }
    if (gc.searchType === "DEF") {
        gc.setSearchType("ADV")
        updateState({ advancedContainerDisplay: 'block'})
    }
  }

  //advanced query toggle button text
  const getTypeName = () => {
    if (gc.searchType === "DEF") return "Advanced"
    else return "Cancel"
  }
  
  //button color 
  const getTypeId = () => {
    if (gc.searchType === "DEF") return ""
    else return "alt"
  }

  const loadMoreResults = (type) => {
    if (state.cardResultsFound !== -1){
      if (state.cardResultIndex < state.cardResults.length - state.showResultAmountCards) {
        updateState({
          cardResultIndex: state.cardResultIndex + state.showResultAmountCards,
        })
      }
    } 
    if (state.deckResultsFound !== -1){
      if (state.deckResultIndex < state.deckResults.length - state.showResultAmountDecks) {
        updateState({
          deckResultIndex: state.deckResultIndex + state.showResultAmountDecks,
        })
      }
    }
    if (state.userResultsFound !== -1){
      if (state.userResultIndex < state.userResults.length - state.showResultAmountUsers) {
        updateState({
          userResultIndex: state.userResultIndex + state.showResultAmountUsers,
        })
      }
    }
  }

  const getShowingAmt = (type) => {
    switch (type) {

      case "card":
        if (state.showResultAmountCards + state.cardResultIndex > state.cardResults.length) return state.cardResults.length
        else return state.showResultAmountCards + state.cardResultIndex
      case "deck":
        if (state.showResultAmountDecks + state.deckResultIndex > state.deckResults.length) return state.deckResults.length
        else return state.showResultAmountDecks + state.deckResultIndex
      case "user":
        if (state.showResultAmountUsers + state.userResultIndex > state.userResults.length) return state.userResults.length
        else return state.showResultAmountUsers + state.userResultIndex
      
    }

  }

  const buildAdvQuery = () => {
    let query = ""
    query += ""
    //build query
    for (let [key, value] of Object.entries(state.advSearch) ) {
      if (value) {
        //add for normal queries
        if (key !== 'colors' && key !== 'color_identity'){
          query += key + "=" + value + "&"
        }

        //build color string
        if (key === 'colors' || key === 'color_identity'){
          let colorBuilder = ""
          let colorCodes = "CBGRUW"
          if (value[0]) {
            colorBuilder += "C&"
          }
          else {
            for (let i = 1; i < value.length; i++){
              if (value[i]) colorBuilder += colorCodes[i] + ","
            }
          }
          colorBuilder = colorBuilder.slice(0,-1)
          if (colorBuilder !== ""){
            query += key + "=" + colorBuilder + "&"
          }
        }
      }
    }
    //remove trailing &
    query = query.slice(0,-1)
    return query
  }

  const setResultsType = (type) => {
    updateState({resultsDisplayMode: type})
  }

  const getResultsID = (type) => {
    if (state.resultsDisplayMode === type) return "typeActive"
    else return "typeInactive"
  }

  const filterResults = (filters) => {
    
    if (filters === "clear"){
      updateState({
        cardResults: state.cardResultsOriginal.sort(sortByName),
        sortType: 'default',
        filters: {
          legality: "",
          rarity: "",
          type: "",
          color_identity: [false,false,false,false,false,false]
        }
      })
      return
    }

    let filteredResults = state.cardResultsOriginal

    for (let [filterkey, filterentry] of Object.entries(filters)){
      if (filterentry !== ""){
        switch(filterkey){
          case 'legality':
            filteredResults = filteredResults.filter((item) => {
              if (item.legalities) {
                // if (entry === "") return true
                for (let [key2, entry2] of Object.entries(item.legalities) ) {
                  if (entry2 === "legal" && key2 === filterentry) return true
                }
              }
            })
            break;
          case 'rarity':
            filteredResults = filteredResults.filter((item) => {
              return item.rarity.toLowerCase().includes(filters.rarity.toLowerCase())
            })
            break;
          case 'type': 
            filteredResults = filteredResults.filter((item) => {
              if (item.type_one) {
                return item.type_one.toLowerCase().includes(filters.type.toLowerCase())
              }
            })
            break;
          case 'color_identity':
            let colors = ["[]", "B", "G", "R", "U", "W"]
            // console.log(colors, filterentry)
            if(filterentry.toString() != [false,false,false,false,false,false].toString()){
              filteredResults = filteredResults.filter((item) => {
                let foundone = false
                for (let i = 0; i < colors.length; i++) {
                  if (filterentry[i] === true && item.color_identity && item.color_identity.toLowerCase().includes(colors[i].toLowerCase())) {
                    foundone = true
                  }
                }
                return foundone
            })
          }
        }
      }
    } 

    

    updateState({
      cardResults: filteredResults,
      cardResultIndex: 0,
    })
  }

  const sortCardsBy = (type) => {
    // console.log(type)
    let cards = state.cardResults

    switch(type){
      case 'default':
        cards = cards.sort(sortByName)
        break
      case 'cmc':
        cards = cards.sort(sortByCMC)
        break
      case 'default2':
        cards = cards.sort(sortByName2)
        break
      case 'cmc2':
        cards = cards.sort(sortByCMC2)
        break
      case 'type':
        cards = cards.sort(sortByType)
        break
      case 'set':
        cards = cards.sort(sortBySet)
        break
    }



    updateState({
      cardResults: cards,
      // cardResultsOriginal: cards,
    })
  }

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMoreResults}
      hasMore={true || false}
      // loader={<div>Loading...</div>}
      // useWindow={true}
      threshold={50}
      >
    <div className="Container" style={{paddingBottom:'200px'}}>
      {/* Advanced search options */}
      <button className='FancyButton' id={getTypeId()} onClick={toggleType} style={{position:'absolute', right:'0', marginRight: '20px'}}>{getTypeName()}</button>
      <div className="AdvancedContainer" style={{display: state.advancedContainerDisplay }}>
      {gc.searchType === "ADV" && 
      <form onSubmit={(event) => { 
        nav("/search/?adv=true/?query=?" + buildAdvQuery())
        event.preventDefault()
      }}>
        <div className="AdvRow">
          <div className="AdvOption">
        Name:</div>
        <input
          value={state.advSearch.name}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,name: e.target.value}})}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        Text: </div>
        <input
          value={state.advSearch.oracle_text}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,oracle_text: e.target.value}})}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        CMC: </div>
        <input
          value={state.advSearch.cmc}
          type="number"
          onChange={(e) => {updateState({advSearch: {...state.advSearch,cmc: e.target.value}})}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        Type: </div>
        <select
          value={state.advSearch.type_}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,type_: e.target.value}})}}
        >
          <option value="">Any Type</option>
          <option value="artifact">Artifact</option>
          <option value="creature">Creature</option>
          <option value="enchantment">Enchantment</option>
          <option value="instant">Instant</option>
          <option value="land">Land</option>
          <option value="planeswalker">Planeswalker</option>
          <option value="sorcery">Sorcery</option>
          <option value="tribal">Tribal</option>
          </select>
        </div><div className="AdvRow">
          <div className="AdvOption">
        Subtype: </div>
        <input
          value={state.advSearch.subtype_}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,subtype_: e.target.value}})}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        Colors: </div>
        {/* <input
          value={state.advSearch.colors}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,colors: e.target.value}})}}
        /> */}
        <input type="checkbox" name="white1" checked={state.advSearch.colors[5]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.colors 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[5] = e.target.checked
            updateState({advSearch: {...state.advSearch,colors: arr}})
          }}></input>
        <label htmlFor="white1" id="symbolW">{mana.replaceSymbols("{W}")}</label>
        <input type="checkbox" name="blue1" checked={state.advSearch.colors[4]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.colors 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[4] = e.target.checked
            updateState({advSearch: {...state.advSearch,colors: arr}})
          }}></input>
        <label htmlFor="blue1" id="symbolU">{mana.replaceSymbols("{U}")}</label>
        <input type="checkbox" name="black1" checked={state.advSearch.colors[1]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.colors 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[1] = e.target.checked
            updateState({advSearch: {...state.advSearch,colors: arr}})
          }}></input>
        <label htmlFor="black1" id="symbolB">{mana.replaceSymbols("{B}")}</label>
        <input type="checkbox" name="red1" checked={state.advSearch.colors[3]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.colors 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[3] = e.target.checked
            updateState({advSearch: {...state.advSearch,colors: arr}})
          }}></input>
        <label htmlFor="red1" id="symbolR">{mana.replaceSymbols("{R}")}</label>
        <input type="checkbox" name="green1" checked={state.advSearch.colors[2]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.colors 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[2] = e.target.checked
            updateState({advSearch: {...state.advSearch,colors: arr}})
          }}></input>
        <label htmlFor="green1" id="symbolG">{mana.replaceSymbols("{G}")}</label>
        <input type="checkbox" name="colorless1" checked={state.advSearch.colors[0]}
          onChange={(e) => {
            let arr = [false, false, false, false, false, false]
            arr[0] = e.target.checked
            updateState({advSearch: {...state.advSearch,colors: arr}})
          }}></input>
        <label htmlFor="colorless1" id="symbolC">{mana.replaceSymbols("{C}")}</label>
        </div><div className="AdvRow">
          <div className="AdvOption">
        Commander: </div>
        <input type="checkbox" name="white2" checked={state.advSearch.color_identity[5]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.color_identity 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[5] = e.target.checked
            updateState({advSearch: {...state.advSearch,color_identity: arr}})
          }}></input>
        <label htmlFor="white2" id="symbolW">{mana.replaceSymbols("{W}")}</label>
        <input type="checkbox" name="blue2" checked={state.advSearch.color_identity[4]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.color_identity 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[4] = e.target.checked
            updateState({advSearch: {...state.advSearch,color_identity: arr}})
          }}></input>
        <label htmlFor="blue2" id="symbolU">{mana.replaceSymbols("{U}")}</label>
        <input type="checkbox" name="black2" checked={state.advSearch.color_identity[1]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.color_identity 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[1] = e.target.checked
            updateState({advSearch: {...state.advSearch,color_identity: arr}})
          }}></input>
        <label htmlFor="black2" id="symbolB">{mana.replaceSymbols("{B}")}</label>
        <input type="checkbox" name="red2" checked={state.advSearch.color_identity[3]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.color_identity 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[3] = e.target.checked
            updateState({advSearch: {...state.advSearch,color_identity: arr}})
          }}></input>
        <label htmlFor="red2" id="symbolR">{mana.replaceSymbols("{R}")}</label>
        <input type="checkbox" name="green2" checked={state.advSearch.color_identity[2]}
          onChange={(e) => {
            // SINGLECOLOR
            let arr = state.advSearch.color_identity 
            // let arr = [false, false, false, false, false, false]
            if (arr[0]) arr[0] = false
            arr[2] = e.target.checked
            updateState({advSearch: {...state.advSearch,color_identity: arr}})
          }}></input>
        <label htmlFor="green2" id="symbolG">{mana.replaceSymbols("{G}")}</label>
        <input type="checkbox" name="colorless2" checked={state.advSearch.color_identity[0]}
          onChange={(e) => {
            let arr = [false, false, false, false, false, false]
            arr[0] = e.target.checked
            updateState({advSearch: {...state.advSearch,color_identity: arr}})
          }}></input>
        <label htmlFor="colorless2" id="symbolC">{mana.replaceSymbols("{C}")}</label>
        </div><div className="AdvRow">
          <div className="AdvOption">
        Power: </div>
        <input
          value={state.advSearch.power}
          type="number"
          onChange={(e) => {updateState({advSearch: {...state.advSearch,power: e.target.value}})}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        Toughness: </div>
        <input
          value={state.advSearch.toughness}
          type="number"
          onChange={(e) => {updateState({advSearch: {...state.advSearch,toughness: e.target.value}})}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        Legality: </div>
        <select
          value={state.advSearch.legalities}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,legalities: e.target.value}})}}
        >
          <option value="">Any Format</option>
          <option value="standard">Standard</option>
          <option value="commander">Commander</option>
          <option value="pioneer">Pioneer</option>
          <option value="explorer">Explorer</option>
          <option value="modern">Modern</option>
          <option value="premodern">Premodern</option>
          <option value="vintage">Vintage</option>
          <option value="legacy">Legacy</option>
          <option value="oldschool">Old School</option>
          <option value="pauper">Pauper</option>
          <option value="historic">Historic</option>
          <option value="alchemy">Alchemy</option>
          <option value="brawl">Brawl</option>
          <option value="paupercommander">Pauper Commander</option>
          <option value="historicbrawl">Historic Brawl</option>
          <option value="penny">Penny Dreadful</option>
          <option value="duel">Duel</option>
          <option value="future">Future</option>
          <option value="gladiator">Gladiator</option>
          </select>
        </div><div className="AdvRow">
          <div className="AdvOption">
        Rarity: </div>
        <select
          value={state.advSearch.rarity}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,rarity: e.target.value}})}}
        >
          <option value="">Any Rarity</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="mythic">Mythic Rare</option>
          </select>
        </div>
        <div className="AdvRow"> <div className="AdvOption">Set Name: </div>
        <input
          value={state.advSearch.set_name}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,set_name: e.target.value}})}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        Set ID: </div>
        <input
          value={state.advSearch.set_shorthand}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,set_shorthand: e.target.value}})}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        Artist: </div>
        <input
          value={state.advSearch.artist}
          onChange={(e) => {updateState({ advSearch: { ...state.advSearch, artist: e.target.value} })}}
        />
        </div><div className="AdvRow">
          <div className="AdvOption">
        Flavor Text: </div>
        <input
          value={state.advSearch.flavor_text}
          onChange={(e) => {updateState({advSearch: {...state.advSearch,flavor_text: e.target.value}})}}
        />
        </div>
        {/* <input className='FancyButton' type="submit" value="Search"
          onClick={() => { 
            nav("/search/?adv=true/?query=?" + buildAdvQuery())
          }}
          ></input> */}
        <button className='FancyButton' 
          onClick={() => { 
            nav("/search/?adv=true/?query=?" + buildAdvQuery())
          }}
          >Search
        </button>
      </form>
      }
      </div>
      <div className='SelectTypeContainer' style={{marginTop: '40px', height: '50px'}}>
        <div 
          className='SelectTypeOption' 
          onClick={() => setResultsType('cards')}
          id={getResultsID('cards')}
          style={{width:'200px', height: '50px'}}
        >
          <div className="SelectTypeText">Cards
          </div>
        </div>
        <div 
          className='SelectTypeOption' 
          onClick={() => setResultsType('decks')}
          id={getResultsID('decks')}
          style={{width:'200px', height: '50px'}}
        >
          <div className="SelectTypeText">Decks
          </div>
        </div>
        <div 
          className='SelectTypeOption' 
          onClick={() => setResultsType('users')}
          id={getResultsID('users')}
          style={{width:'200px', height: '50px'}}
        >
          <div className="SelectTypeText">Users</div>
        </div>
      </div>
      {/* if there are no results yet, show searching */}
      {/* { (state.cardResultsFound < 0 || state.deckResultsFound < 0 || state.userResultsFound < 0) &&  */}
      { (state.cardResultsFound < 0 || state.deckResultsFound < 0 || state.userResultsFound < 0 ) && 
        <div className="HeaderText" style={{textAlign:'center'}}>
          Searching...
          {/* <img src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif"/> */}
        </div>
      }
      {/* if no results are found, show error */}
      {/* { (state.cardResultsFound == 0 && state.deckResultsFound == 0 && state.userResultsFound == 0) && */}
      { (state.cardResultsFound == 0 && state.deckResultsFound == 0 && state.userResultsFound == 0) &&
      <div className="HeaderText" style={{textAlign:'center'}}>
        No results found :(
      </div>
      }

      {/* if there are any card results, display them */}
      {state.resultsDisplayMode === "cards" && <div>
      {state.cardResultsFound > 0 && 
      
      <div className="Results">
        
        <div style={{display:'block', textAlign:'left'}}>
          <header className="HeaderText">Cards</header>
          Cards found: {state.cardResults.length} | Showing: {getShowingAmt("card")}
        </div>
        {/* <header className="HeaderText">Filters:</header> */}
        <div className='SelectTypeContainer' style={{backgroundColor: '#e8e8e8', marginTop: '10px', borderRadius: '8px', padding: '20px', height: '60px'}}>
   
          <div className='SelectTypeOption'>
          Sort: 
          <select
            value ={state.sortType}
            onChange={(e) => {
              updateState({ sortType: e.target.value })
              sortCardsBy(e.target.value)
            }}
          >
            <option value="default">Alphabetical (A-Z)</option>
            <option value="default2">Alphabetical (Z-A)</option>
            <option value="cmc">Mana Value (Ascending)</option>
            <option value="cmc2">Mana Value (Descending)</option>
            {/* <option value="type">Type</option> */}
            {/* <option value="set">Set</option> */}
            </select>
          </div>
          <div className='SelectTypeOption'>
          Rarity: 
          <select
            value ={state.filters.rarity}
            onChange={(e) => {
              let filters = state.filters
              filters.rarity = e.target.value
              updateState({ filters: filters })
              filterResults(filters)
            }}
          >
            <option value="">Any Rarity</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="mythic">Mythic Rare</option>
            </select>
          </div>
          <div className='SelectTypeOption'>
          Type: 
          <select
            onChange={(e) => {
              let filters = state.filters
              filters.type = e.target.value
              updateState({ filters: filters })
              filterResults(filters)
            }}
            value={state.filters.type}
          >
            <option value="">Any Type</option>
            <option value="artifact">Artifact</option>
            <option value="creature">Creature</option>
            <option value="enchantment">Enchantment</option>
            <option value="instant">Instant</option>
            <option value="land">Land</option>
            <option value="planeswalker">Planeswalker</option>
            <option value="sorcery">Sorcery</option>
            <option value="tribal">Tribal</option>
            </select>
          </div>
          <div className='SelectTypeOption'>
          Legality: 
          <select
            value ={state.filters.legality}
            onChange={(e) => {
              let filters = state.filters
              filters.legality = e.target.value
              updateState({ filters: filters })
              filterResults(filters)
            }}
          >
            <option value="">Any Format</option>
            <option value="standard">Standard</option>
            <option value="commander">Commander</option>
            <option value="pioneer">Pioneer</option>
            <option value="explorer">Explorer</option>
            <option value="modern">Modern</option>
            <option value="premodern">Premodern</option>
            <option value="vintage">Vintage</option>
            <option value="legacy">Legacy</option>
            <option value="oldschool">Old School</option>
            <option value="pauper">Pauper</option>
            <option value="historic">Historic</option>
            <option value="alchemy">Alchemy</option>
            <option value="brawl">Brawl</option>
            <option value="paupercommander">Pauper Commander</option>
            <option value="historicbrawl">Historic Brawl</option>
            <option value="penny">Penny Dreadful</option>
            <option value="duel">Duel</option>
            <option value="future">Future</option>
            <option value="gladiator">Gladiator</option>
            </select>
          </div>
          <div className='SelectTypeOption' id="colorIdBoxes">Colors: <div className="AdvRow">
        <input type="checkbox" name="white3" 
          checked={state.filters.color_identity[5]}
          onChange={(e) => {
            let filters = state.filters
            if (filters.color_identity[0]) filters.color_identity[0] = false
            filters.color_identity[5] = e.target.checked
            updateState({ filters: filters })
            filterResults(filters)
          }}></input>
        <label htmlFor="white3" >{mana.replaceSymbols("{W}")}</label>
        <input type="checkbox" name="blue3" 
        checked={state.filters.color_identity[4]}
          onChange={(e) => {
            let filters = state.filters
            if (filters.color_identity[0]) filters.color_identity[0] = false
            filters.color_identity[4] = e.target.checked
            updateState({ filters: filters })
            filterResults(filters)
          }}></input>
        <label htmlFor="blue3" >{mana.replaceSymbols("{U}")}</label>
        <input type="checkbox" name="black3" 
        checked={state.filters.color_identity[1]}
          onChange={(e) => {
            let filters = state.filters
            if (filters.color_identity[0]) filters.color_identity[0] = false
            filters.color_identity[1] = e.target.checked
            updateState({ filters: filters })
            filterResults(filters)
          }}></input>
        <label htmlFor="black3" >{mana.replaceSymbols("{B}")}</label>
        <input type="checkbox" name="red3" 
        checked={state.filters.color_identity[3]}
          onChange={(e) => {
            let filters = state.filters
            if (filters.color_identity[0]) filters.color_identity[0] = false
            filters.color_identity[3] = e.target.checked
            updateState({ filters: filters })
            filterResults(filters)
          }}></input>
        <label htmlFor="red3" >{mana.replaceSymbols("{R}")}</label>
        <input type="checkbox" name="green3" 
        checked={state.filters.color_identity[2]}
          onChange={(e) => {
            let filters = state.filters
            if (filters.color_identity[0]) filters.color_identity[0] = false
            filters.color_identity[2] = e.target.checked
            updateState({ filters: filters })
            filterResults(filters)
          }}></input>
        <label htmlFor="green3" >{mana.replaceSymbols("{G}")}</label>
        <input type="checkbox" name="colorless3" 
        checked={state.filters.color_identity[0]}
          onChange={(e) => {
            let filters = state.filters
            filters.color_identity = [false, false, false, false, false, false]
            filters.color_identity[0] = e.target.checked
            updateState({ filters: filters })
            filterResults(filters)
          }}></input>
        <label htmlFor="colorless3">{mana.replaceSymbols("{C}")}</label>
        </div></div>
        <button className="FancyButton" onClick={(e) => filterResults('clear')} style={{marginTop: '-12px'}}>Reset</button>
        </div>
        <br></br>
        <div className="ResultsContainer">
        { state.cardResults.slice(0, state.cardResultIndex + state.showResultAmountCards)
          .map((item, i) => <div style={{marginLeft: '10px', float:'left'}}key={i}>
            {/* { gc.devMode && <CardObject data={item} isCompact={true} 
            // count={i % 4}
            // count={4 - i % 4}
            // count={4}
            /> } */}
            <div className="RegularCard">
              <CardObject data={item}/>
            </div>
            </div>) }
          </div>
        </div>
        }
      </div>
      }
      
      {/* if there are any deck results, display them */}
      {state.resultsDisplayMode === "decks" && <div>
      {state.deckResults.length > 0 && 
      <div className="Results">
        <div style={{display:'block', textAlign:'left'}}>
          <header className="HeaderText">Decks</header>
          Decks found: {state.deckResults.length} | Showing: {getShowingAmt("deck")}
        </div>
        <br></br>
        <div className="ResultsContainer" style={{maxWidth:'1250px'}} >
        { state.deckResults.slice(0, state.deckResultIndex + state.showResultAmountDecks).map((item, i) => <DeckTileObject data={item} key={i}/>) }
        </div>
      </div>
      }
      </div>}
      
      {/* if there are any user results, display them */}
      {state.resultsDisplayMode === "users" && <div>
      {state.userResults.length > 0 && 
      <div className="Results">
        <div style={{display:'block', textAlign:'left'}}>
          <header className="HeaderText">Users</header>
          Users found: {state.userResults.length} | Showing: {getShowingAmt("user")}
        </div>
        <br></br>
        <div className="ResultsContainer" style={{maxWidth:'1250px'}} >
        {state.userResults.slice(0, state.userResultIndex + state.showResultAmountUsers).map((item, i) => <UserObject data={item} key={i}/>) }
        </div>
      </div>
    }
    </div>}
    </div>
  </InfiniteScroll>
  );

};

export default SearchResults;