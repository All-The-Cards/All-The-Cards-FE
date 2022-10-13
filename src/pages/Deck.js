import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import * as utilities from '../functions/Utilities.js';

import { useSearchParams, useNavigate } from 'react-router-dom';
import CardStack from '../components/CardStack/CardStack.js';
import { GlobalContext } from "../context/GlobalContext";
import Footer from '../components/Footer/Footer.js';

const Deck = (props) => {

  const gc = useContext(GlobalContext)

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
  }, [])

  const [state, setState] = useState({
    data: {
      cards: []
    },
    viewMode: "Spread",
    compactView: false,
    shared: false
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
        document.title = response.name
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

  const copyDeck = (event) => {
    gc.setWipDeck((previous) => ({
      ...previous,
      title: state.data.name,
      description: state.data.description,
      tags: state.data.tags,
      formatTag: state.data.format,
      cards: state.data.cards
    }))
    nav('/deckeditor')
  }

  const copyURLToClipboard = (event) => {
    let element = document.createElement('input');
    element.value = window.location.href;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
    setState((previous) => ({
      ...previous,
      shared: true
    }))
  }

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
      {state.data.name} - {state.data.user_name}
      <br/>
      {state.data.description}
      <br/>
      Format: {state.data.format}
      <br/>
      Tags: {state.data.tags != undefined ? (state.data.tags.map((tag, index) => (<>{tag},</>))) : (<></>) }
      <div style={{ display: "flex", flexFlow: "row nowrap" }}>
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
          <input type="checkbox" checked={state.compactView} onChange={handleCheckbox} />
        </label>
        <input type="button" onClick={copyDeck} value={(gc.activeSession != null && gc.activeSession.user.id === state.data.user_id) ? "Edit Deck" : "Copy Deck"} />
        {/* TODO:: notification instead of button text switch, replace text with icon */}
        <input type="button" onClick={copyURLToClipboard} value={state.shared ? "Shareable Link Copied" : "Get Shareable Link"} />
      </div>
      <div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center", width: "100%", gap: "16px" }}>
        {state.viewMode === "Spread" ? <>
          {state.data.cards.map((card, i) =>
            <div style={{ margin: '10px', display: 'inline-block' }} key={i}><CardObject data={card} isCompact={state.compactView} /></div>
          )}
        </> : <></>}
        {state.viewMode === "Stacked" ? <CardStack cards={state.data.cards} isCompact={state.compactView} /> : <></>}
        {state.viewMode === "Categorized" ? <>
          {utilities.mapCardsToTypes(state.data.cards).map((typeList) => (
            <CardStack cards={typeList.cards} label={typeList.type} isCompact={state.compactView} />
          ))}
        </> : <></>}
      </div>
      <Footer />
    </div>
  );

};

export default Deck;