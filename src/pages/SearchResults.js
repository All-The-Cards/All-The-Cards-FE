import { React, useState, useEffect } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';

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

    const nav = useNavigate()

    const query = useSearchParams()[0].toString()

    //on page load, or whenever the /search/?query= changes
    useEffect(() => {
        console.log(query)
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

  const handleChanges = (event) => {
    updateState({
      searchInput: event.target.value
    })
  }
  return (
    <div>
      <input
        placeholder="Search..."
        value={state.searchInput}
        onChange={handleChanges}>
      </input>
      <button 
        onClick={() => {
            if (state.searchInput.trim() !== "") {
                nav("/search/?query=" + state.searchInput)
            }
        }}>Search</button>
      <div style={{ width: '400px' }}>
        <div>
          {state.resultsFound}
        </div>
        {state.searchResults.map((item, i) => <CardObject data={item} key={i} />)}
      </div>
    </div>
  );

};

export default SearchResults;