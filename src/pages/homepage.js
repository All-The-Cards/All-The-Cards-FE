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

  const search = (query) => {
    //if query is empty, don't send
    if (query.trim() === "/api/search/query=") {
      return
    }
    //clear results
    setState({
      searchResults: []
    })

    ServerTalk.post(query).then(response => {
      if (response.length === 0) {
        setState({
          resultsFound: <div>No Results Found</div>
        })
      }
      else {
        setState({
          resultsFound: <div>{response.length} Results Found</div>,
          searchResults: response.map((item, i) => <CardObject data={item} key={i} />)
        })
      }

      return response
    }).then(response => {
      console.log(response)
    })

  }

  const setInput = (input) => {
    setState({
      searchInput: input.target.value
    })
  }
  return (
    <div>
      <input
        placeholder="Search..."
        value={state.searchInput}
        onChange={(input) => setInput(input)}>
      </input>
      <button onClick={() => search("/api/search/query=" + state.searchInput)}>Search</button>
      <div style={{ width: '400px' }}>
        <div>
          {state.resultsFound}
        </div>
        {state.searchResults}
      </div>
    </div>
  );

};

export default Home;