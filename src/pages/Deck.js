import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import * as utilities from '../functions/Utilities.js';

import { useSearchParams, useNavigate } from 'react-router-dom';
import CardStack from '../components/CardStack/CardStack.js';
import { GlobalContext } from "../context/GlobalContext";

const Deck = (props) => {

  const gc = useContext(GlobalContext)

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
  }, [])

  const [state, setState] = useState({
    data: {
      cards: []
    },
    isFavorited: false,
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
    updateState({
      id: id
    })
    getDeckById(id)
    getFavStatus(id)
  }, [id])

  const getDeckById = (query) => {
    query = "/api/get/deck/" + query
    //if query is empty, don't send
    if (query.trim() === "/api/get/deck/") {
      return
    }

    server.post(query).then(response => {
      // console.log(response)
      //if invalid, just direct to search page
      if (response.length === 0) {
        nav('/search/')
      }
      else {
        document.title = response.name
        updateState({
          data: response
        })
        // console.log(response)
        console.log(utilities.mapCardsToTypes(response))
      }

    })

  }
  const getFavStatus = (id) => {
    id = id.substring(3)
    // console.log("FAV ID:", id)

    if (gc.activeSession) {
      const uid = gc.activeSession.user.id
      const query = "/api/get/user/" + "id=" + uid
      //if query is empty, don't send
      if (query.trim() === "/api/get/user/" ) {
        return
      }
      server.post(query).then(response => {
        // console.log("User: ", response[0])
        //if invalid, just direct to search page
        if (response.length === 0) {
          nav('/')
        }
        else {
          // console.log("user:",response[0])
          // console.log(id)
          if (response[0].favorites.decks.includes(id)){
            // console.log("Favorite found")
            updateState({
              isFavorited: true
            })
          }
          else {
            // console.log("No match")
            updateState({
              isFavorited: false
            })
          }
        }  
      })
    }
          
    
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

  const toggleFavorite = () => {
    const sendData = {
      deck: state.id.substring(3)
    }
    console.log("Sending fav update: ", sendData)

    fetch(server.buildAPIUrl("/api/features/user/favorite"),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': gc.activeSession.access_token
        },
        //send inputs
        body: JSON.stringify(sendData),

      }
    )
    .then((response) => {
      console.log(response);
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
      updateState({
        isFavorited: !state.isFavorited
      })
    }

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
      <div onClick={() => {
        toggleFavorite()
        }}
        style={{float: 'right', marginRight: '20px', marginTop: '10px'}}
        >
      { state.isFavorited &&
        <div className="FavoriteIcon" style={{backgroundColor: "Gold"}}>-</div> ||
        <div className="FavoriteIcon" style={{backgroundColor: "#dadada"}}>+</div>
      }
      </div>
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
        <input type="button" onClick={copyDeck} value="Copy Deck" />
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
    </div>
  );

};

export default Deck;