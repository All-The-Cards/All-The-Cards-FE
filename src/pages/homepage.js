import { React, useState } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as ServerTalk from '../functions/ServerTalk.js';

const Home = (props) => {

  const [state, setState] = useState({
    searchResults: [],
    resultsFound: "",
    serverResponse: "",
    searchInput: ""
  })

  const updateState = (objectToUpdate) => {
    setState((previous) => ({
      ...previous,
      ...objectToUpdate
    }))
  }

  const search = (query) => {
    //if query is empty, don't send
    if (query.trim() === "/api/search/query=") {
      return
    }
    //clear results
    updateState({ searchResults: [] })

    ServerTalk.post(query).then(response => {
      if (response.length === 0) {
        updateState({ resultsFound: <div>No Results Found</div> })
      }
      else {
        updateState({
          resultsFound: <div>{response.length} Results Found</div>,
          searchResults: response
        })
      }

    }).then(response => {
      console.log(response)
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
      <button onClick={() => search("/api/search/query=" + state.searchInput)}>Search</button>
      <div style={{ width: '400px' }}>
        <div>
          {state.resultsFound}
        </div>
        {state.searchResults.map((item, i) => <CardObject data={item} key={i} />)}
      </div>
    </div>
  );

};

export default Home;