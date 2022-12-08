import { React, useState, useEffect, useContext } from 'react';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './GlobalStyles.css'
import './User.css'
import DeckTileObject from '../components/DeckTileObject/DeckTileObject.js';

import { GlobalContext } from "../context/GlobalContext";
import CardObject from '../components/CardObject/CardObject.js';

const User = (props) => {

  const gc = useContext(GlobalContext);

  const [state, setState] = useState({
    data: {},
    decks: [],
    favCards: [],
    favDecks: [],
    customCards: []
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
    gc.setSearchBar(props.hasSearchBar)
    updateState({
      decks: [],
      favCards: [],
      favDecks: [],
      customCards: []
    })
    // console.log(id)
    getUserById(id)
    getDecksByUserId(id)
    getCustomCardsByUserId(id)

  }, [id])

  const getUserById = (query) => {
    query = "/api/get/user/" + query
    //if query is empty, don't send
    if (query.trim() === "/api/get/user/") {
      return
    }

    server.post(query).then(response => {
      // console.log("User: ", response[0])
      //if invalid, just direct to search page
      if (response.length === 0) {
        nav('/search/')
      }
      else {
        document.title = response[0].username
        updateState({
          data: response[0],
        })
        buildFavCards(response[0].favorites.cards)
        buildFavDecks(response[0].favorites.decks)
      }
    })

  }

  const buildFavCards = (cards) => {
    // console.log("FAV CARDS: ", cards)
    const arr = []
    const query = "/api/get/card/id="
    for (let i = 0; i < cards.length; i++) {
      server.post(query + cards[i]).then(response => {
        // console.log(response[0])
        //if invalid, just direct to search page
        if (response.length === 0) {
          nav('/search/')
        }
        else {
          arr.push(response[0])
          updateState({
            favCards: arr
          })
        }
      })
    }
  }
  const sortByName = (a, b) => {
    if (a.name >= b.name) {
      return 1
    }
    else {
      return -1
    }
  }
  const buildFavDecks = (decks) => {
    // console.log("FAV DECKS: ", decks)
    const arr = []

    const query = "/api/get/deck/id="
    for (let i = 0; i < decks.length; i++) {
      server.post(query + decks[i]).then(response => {
        // console.log("DECK FOUND:", response)
        //if invalid, just direct to search page
        if (response.length === 0) {
          nav('/')
        }
        else {
          arr.push(response)
          updateState({
            favDecks: arr
          })
        }
      })
    }
  }

  const getDecksByUserId = (query) => {
    query = "/api/get/decks/user_" + query
    //if query is empty, don't send
    if (query.trim() === "/api/get/decks/user_id=") {
      return
    }

    server.post(query).then(response => {
      // console.log("User Decks: ", response)
      //if invalid, just direct to search page
      if (response.length === 0) {
        // nav('/search/')
      }
      else {
        updateState({
          decks: response,
        })
      }
    })

  } 
  
  const getCustomCardsByUserId = (query) => {
    query = "/api/get/cards/user_" + query
    //if query is empty, don't send
    if (query.trim() === "/api/get/cards/user_id=") {
      return
    }

    server.post(query).then(response => {
      // console.log("User Decks: ", response)
      //if invalid, just direct to search page
      if (response.length === 0) {
        // nav('/search/')
      }
      else {
        updateState({
          customCards: response,
        })
      }
    })

  }

  const sortDecks = (a,b) => {
    // console.log(a,b) 
    if (a.created >= b.created) {
      return -1
    }
    else {
      return 1
    }
  }

  return (
    <>
      <div className="Container Page">
        <div className="UserPageContent" >
          <div className="UserPage-Left">
            <div className="UserInfo">
              <div className="ProfilePicture" style={{ backgroundImage: "url(" + state.data.avatar + ")", float: "left" }}></div>

              <div className="UserDetails">
                <div className="HeaderText">
                  {state.data.username}
                </div>
                <div className="BodyText">
                  <i>{state.data.location}</i>
                </div>
              </div>
            </div>
          </div>
          <div className="UserPage-Right">
            <div className="HeaderText" style={{ fontSize: "28px" }}>
              About Me
            </div>
            <div className="BodyText" style={{ fontStyle:'italic' }}>
              {state.data.bio}
            </div>
          </div>
        </div>
        {state.decks.length > 0 &&
          <div className="UserPageContent" id="deckContent"><div className="HeaderText">
            Decks
          </div>
          <div className="OverflowScroll">{state.decks.sort(sortDecks).map((item, i) => <div style={{ marginRight: '10px', float: 'left' }} key={i}>
              <DeckTileObject data={item} />
            </div>)}</div>
          </div>}

        {state.data.favorites &&
          <div className="UserPageContent" id="deckContent"><div className="HeaderText">
            Favorite Cards
          </div>
          {/* {state.favCards.sort(sortByName).slice(0, 4).map((item, i) => <div style={{ marginLeft: '10px', float: 'left' }} key={i}> */}
          <div className="OverflowScroll">{state.favCards.sort(sortByName).map((item, i) => <div style={{ marginRight: '10px', float: 'left'}} key={i}>
              {/* { gc.devMode && <CardObject data={item} isCompact={true} 
            // count={i % 4}
            // count={4 - i % 4}
            // count={4}
            /> } */}
              <div className="RegularCard">
                <CardObject clickable data={item} />
              </div>
            </div>)
            }</div>
          </div>}

        {state.data.favorites &&
          <div className="UserPageContent" id="deckContent"><div className="HeaderText">
            Favorite Decks
          </div>

          {/* {state.favDecks.slice(0, 3).map((item, i) => <div style={{ marginLeft: '10px', float: 'left' }} key={i}> */}
          <div className="OverflowScroll">{state.favDecks.sort(sortDecks).map((item, i) => <div style={{ marginRight: '10px', float: 'left' }} key={i}>
              <DeckTileObject data={item} />
            </div>)}</div>
          </div>} 


          
          {state.customCards.length > 0 &&
          <div className="UserPageContent" id="deckContent" style={{marginBottom:'200px'}}><div className="HeaderText">
            Custom Cards
          </div>
          {/* {state.favCards.sort(sortByName).slice(0, 4).map((item, i) => <div style={{ marginLeft: '10px', float: 'left' }} key={i}> */}
          <div className="OverflowScroll">{state.customCards.sort(sortByName).map((item, i) => <div style={{ marginRight: '10px', float: 'left'}} key={i}>
              {/* { gc.devMode && <CardObject data={item} isCompact={true} 
            // count={i % 4}
            // count={4 - i % 4}
            // count={4}
            /> } */}
              <div className="RegularCard">
                <CardObject clickable data={item} />
              </div>
            </div>)
            }</div>
          </div>}

      </div>
    </>
  );

};

export default User;