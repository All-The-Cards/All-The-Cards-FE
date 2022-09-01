import { React, useState, useEffect } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import CardListObject from '../components/CardListObject/CardListObject.js';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams } from 'react-router-dom';

const SearchResults = (props) => {

    const [state, setState] = useState({
        searchResults: [],
        resultsFound: "",
        serverResponse: "",
        searchInput: "",
        query: ""
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
        //search if query not empty
        if(query.trim() !== "query=") search(query)
    }, [query])

  const search = (query) => {
    query = "/api/search/" + query
    //if query is empty, don't send
    if (query.trim() === "/api/search/" ) {
      return
    }
    //clear results
    updateState({ searchResults: [] })

    server.post(query).then(response => {
      if (response.length === 0) {
        updateState({ resultsFound: <div>No Results Found</div> })
      }
      else {
        updateState({
          resultsFound: <div>{response.length} Results Found</div>,
          searchResults: response
        })
      }

    })

  }

  return (
    <div>
        <div>
          {state.resultsFound}
        </div>
        {/* {state.searchResults.map((item, i) => <CardListObject data={item} key={i} />)}
        <div style={{height: 100}}></div>
        {state.searchResults.map((item, i) => <CardObject data={item} key={i} />)} */}
        {state.searchResults.map((item, i) => 
          <div style={{margin: '10px'}}key={i}><CardListObject data={item}/> <CardObject data={item}/></div>
        )}
      
    </div>
  );

};

export default SearchResults;