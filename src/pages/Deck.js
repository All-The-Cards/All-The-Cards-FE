import { React, useState, useEffect } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import * as utilities from '../functions/Utilities.js';

import { useSearchParams, useNavigate } from 'react-router-dom';
import CardList from '../components/CardStack/CardStack.js';

const Deck = (props) => {

  const [state, setState] = useState({
    data: [],
    viewMode: "Spread",
    compactView: false
  })

  const updateState = (objectToUpdate) => {
    setState((previous) => ({
      ...previous,
      ...objectToUpdate
    }))
  }

  const nav = useNavigate()
  const id = useSearchParams()[0].toString()

  useEffect(() => {
    //clean up string from id format to search query format
    getDeckById(id)
  }, [id])

  const getDeckById = (query) => {
    query = "/api/get/deck/" + query
    //if query is empty, don't send
    if (query.trim() === "/api/get/deck/") {
      return
    }

    server.post(query).then(response => {
      console.log(response)
      //if invalid, just direct to search page
      if (response.length === 0) {
        nav('/search/')
      }
      else {
        updateState({
          data: response
        })
        console.log(response)
        console.log(utilities.mapCardsToTypes(response))
      }

    })

  }

  const handleDropdown = (event) => {
    updateState({ viewMode: event.target.value })
  }

  const handleCheckbox = (event) => {
    updateState({ compactView: !state.compactView })
    console.log("Checkbox checked!")
    console.log(state.compactView)
  }

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
      {state.data.name}
      <div style={{display: "flex", flexFlow: "row nowrap"}}>
      <label>
        View mode:
        <select value={state.viewMode} onChange={handleDropdown}>
          <option value="Spread">Spread</option>
          <option value="Stacked">Stacked</option>
          <option value="Categorized">Categorized</option>
        </select>
      </label>
      <label>
        Compact:
        <input type="checkbox" checked={state.compactView} onChange={handleCheckbox}/>
      </label>
      </div>

      {state.viewMode === "Spread" ? <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
        {state.data.map((card, i) =>
          <div style={{ margin: '10px', display: 'inline-block' }} key={i}><CardObject data={card} isCompact={state.compactView}/></div>
        )}
      </div> : <></>}
      {state.viewMode === "Stacked" ? <CardList cards={state.data} isCompact={state.compactView}/> : <></>}
      {state.viewMode === "Categorized" ? <div style={{display: 'flex', flexFlow: 'row wrap'}}>
          {utilities.mapCardsToTypes(state.data).map((typeList) => (
            <CardList cards={typeList.cards} label={typeList.type} isCompact={state.compactView}/>
          ))}
      </div> : <></>}

    </div>
  );

};

export default Deck;