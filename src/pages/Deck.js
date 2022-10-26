import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import * as utilities from '../functions/Utilities.js';
import * as stats from '../functions/Stats.js';
import './Deck.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import CardStack from '../components/CardStack/CardStack.js';
import { GlobalContext } from "../context/GlobalContext";
import Footer from '../components/Footer/Footer.js';
import TagList from '../components/TagList/TagList.js';

const Deck = (props) => {

  const gc = useContext(GlobalContext)
  const { darkMode } = useContext(GlobalContext)

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
  }, [])

  const [state, setState] = useState({
    data: {
      cards: []
    },
    isFavorited: false,
    viewMode: "Categorized",
    compactView: true,
    shared: false,
    deckStats: {}
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
          data: response,
          deckStats: stats.getDeckStats(response.cards)
        })
        // console.log(response)
        // console.log(utilities.mapCardsToTypes(response))
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
      if (query.trim() === "/api/get/user/") {
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
          if (response[0].favorites.decks.includes(id)) {
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
      cards: state.data.cards,
      coverCard: {
        image_uris: {
          art_crop: state.data.cover_art
        }
      },
      deckID: gc.activeSession != null ? state.data.deck_id : "",
      authorID: gc.activeSession != null ? state.data.user_id : "",
    }))
    utilities.saveToLocalStorage("wipDeck", gc.wipDeck)
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
    <div className={`DeckPage ${darkMode ? "DeckPageDark" : ''}`}>
      <div style={{ display: 'flex', flexFlow: 'column nowrap', margin: 'auto', alignItems: 'center', minWidth: '300px', maxWidth: '60%' }}>
        {
          gc.activeSession &&
          <div onClick={() => {
            toggleFavorite()
          }}
            style={{ float: 'right', marginRight: '20px', marginTop: '10px' }}
          >
            {state.isFavorited &&
              <div className="FavoriteIcon" style={{ backgroundColor: "Gold" }}>-</div> ||
              <div className="FavoriteIcon" style={{ backgroundColor: "#dadada" }}>+</div>
            }
          </div>
        }
        <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', alignItems: 'center', margin: '40px 8px 0 8px', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '2rem' }}>{state.data.name} - </span><span style={{ fontSize: '1.5rem', marginLeft: '0.5rem' }}>{state.data.user_name}</span>
            {state.data.cards.length > 0 && <input type="button" onClick={copyDeck} value={(gc.activeSession != null && gc.activeSession.user.id === state.data.user_id) ? "Edit Deck" : "Copy Deck"} />}
            {/* TODO:: notification instead of button text switch, replace text with icon */}
            <input type="button" onClick={copyURLToClipboard} value={state.shared ? "Shareable Link Copied" : "Get Shareable Link"} />
          </div>
          <span>{`Format: ${state.data.format}`}</span>
        </div>
        <br />
        <div style={{ width: '100%' }}>
          {state.data.tags != undefined ? (<TagList tags={state.data.tags} />) : (<></>)}
        </div>
        <div style={{ width: "100%", margin: '8px 0 0 24px' }}>
          {state.data.description}
        </div>
        <div style={{ display: "flex", flexFlow: "row nowrap", width: "100%", margin: '16px 0 0 8px', gap: '16px' }}>
          <label>
            View mode:
            <select style={{ marginLeft: '8px' }} value={state.viewMode} onChange={handleDropdown}>
              <option value="Spread">Spread</option>
              <option value="Stacked">Stacked</option>
              <option value="Categorized">Categorized</option>
            </select>
          </label>
          <label>
            Compact:
            <input type="checkbox" checked={state.compactView} onChange={handleCheckbox} />
          </label>
        </div>
        <div>
          {/* {JSON.stringify(state.deckStats, null, '\n')} */}
        </div>
        <div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center", width: "100%", gap: "16px" }}>
          {state.viewMode === "Spread" ? <>
            {state.data.cards.map((card, i) =>
              <div style={{ margin: '10px', display: 'inline-block' }} key={i}><CardObject data={card} isCompact={state.compactView} /></div>
            )}
          </> : <></>}
          {state.viewMode === "Stacked" ? <CardStack cards={state.data.cards} isCompact={state.compactView} /> : <></>}
          {state.viewMode === "Categorized" ? <>
            {utilities.mapCardsToTypes(state.data.cards).map((typeList, i) => (
              <CardStack key={i} cards={typeList.cards} label={typeList.type} isCompact={state.compactView} />
            ))}
          </> : <></>}
        </div>
      </div>
    </div>
  );
};

export default Deck;