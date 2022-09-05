import { React, useState, useEffect } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams } from 'react-router-dom';

const SearchResults = (props) => {

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
          search(query, 'card')
          search(query, 'deck')
          // search(query, 'user')
        }
    }, [query])

  const search = (query, type) => {
    //fix formatting to what server expects
    query = query.replaceAll('+', '%20')
    query = "/api/search/" + type + "/" + query
    //if query is empty, don't send
    if (query.trim() === "/api/search/" ) {
      return
    }

    server.post(query).then(response => {
      let res = response

      //sort results alphabetically
      res = res.sort(alphabeticalSortByName)

      //find duplicates, omit from appearing
      let uniqueNames = []
      const uniqueRes = res.filter((item) => {
        let duplicate = uniqueNames.includes(item.name)
        if (!duplicate) {
          uniqueNames.push(item.name)
          return true;
        }
        return false;
      })
      res = uniqueRes

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

  const alphabeticalSortByName = (a, b) => {
    if (a.name >= b.name) {
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