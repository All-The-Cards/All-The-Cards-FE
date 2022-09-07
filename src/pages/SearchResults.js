import { React, useState, useEffect, useContext} from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams } from 'react-router-dom';

import { GlobalContext } from "../context/GlobalContext";

const SearchResults = (props) => {


  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

  useEffect(() => {
    setSearchBar(props.hasSearchBar)
  }, [])

    const [state, setState] = useState({
      cardResults: [],
      deckResults: [],
      userResults: [],

      cardResultIndex: 0,
      deckResultIndex: 0,
      userResultIndex: 0,

      showResultAmount: 10
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }

    const query = useSearchParams()[0].toString()

    //on page load, or whenever the /search/?query= changes
    useEffect(() => {
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
          // search(query, 'user')
        }
    }, [query])

  const search = (query, type) => {
    let showAll = false
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
      // console.log(res)

      let invalidTypes = ['vanguard', 'token', 'memorabilia', 'planar']
      let realCardRes = res.filter((item) => {
        return !invalidTypes.includes(item.set_type) && !invalidTypes.includes(item.layout)
      })

      res = realCardRes

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
          // updateState({          
          //   userResults: res
          // })
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
    <div>
      <div>
        Cards found: 
        {state.cardResults.length}
        <button onClick={() => { updateState({
          cardResultIndex: state.cardResultIndex - state.showResultAmount,

        })}}>Previous {state.showResultAmount}</button>
        <button onClick={() => { updateState({
          cardResultIndex: state.cardResultIndex + state.showResultAmount,

        })}}>Next {state.showResultAmount}</button>
        
        Showing: {state.cardResultIndex + 1} through {state.showResultAmount + state.cardResultIndex}
      </div>
      
      <div style={{overflow:'auto', whiteSpace:'nowrap'}}>
        {state.cardResults.slice(state.cardResultIndex, state.cardResultIndex + state.showResultAmount).map((item, i) => 
            <div style={{margin: '10px', display:'inline-block'}}key={i}><CardObject data={item}/></div>
          )
        }
      </div>

      
      <div>
        Decks found: 
        {state.deckResults.length}
        <button onClick={() => { updateState({
          deckResultIndex: state.deckResultIndex - state.showResultAmount,

        })}}>Previous {state.showResultAmount}</button>
        <button onClick={() => { updateState({
          deckResultIndex: state.deckResultIndex + state.showResultAmount,

        })}}>Next {state.showResultAmount}</button>

        
        Showing: {state.deckResultIndex + 1} through {state.showResultAmount + state.deckResultIndex}
        
      </div>
      
      <div style={{overflow:'auto', whiteSpace:'nowrap'}}>
        {state.deckResults.slice(state.deckResultIndex, state.deckResultIndex + state.showResultAmount).map((item, i) => 
            <div style={{margin: '10px', display:'inline-block'}}key={i}><DeckTileObject data={item}/></div>
          )
        }
      </div>
        {/* Users found: 
        {state.userResults.map((item, i) => 
            <div style={{margin: '10px'}}key={i}><UserObject data={item}/></div>
          )
        }  */}
       
    </div>
  );

};

export default SearchResults;