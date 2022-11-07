import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import UserObject from '../components/UserObject/UserObject.js';
import * as server from '../functions/ServerTalk.js';
import * as utilities from '../functions/Utilities.js';
import * as stats from '../functions/Stats.js';
import * as graphs from '../functions/Graphs.js';
import './Deck.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import CardStack from '../components/CardStack/CardStack.js';
import { GlobalContext } from "../context/GlobalContext";
import TagList from '../components/TagList/TagList.js';
import Card from './Card.js';
import { Link } from "react-router-dom";

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
    deckStats: {},
    deckGraphs: {},
    showRawGraphs: false,
    hasGottenDeck: false,
    showFullDescription: false
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
    // getDeckOffline()
    getDeckById(id)
    getFavStatus(id)
  }, [id])

  const getDeckOffline = () => {
    let deck = JSON.parse(localStorage.getItem("TEST_DECK"))
    document.title = deck.name
      updateState({
        data: deck,
        deckStats: stats.getDeckStats(deck.cards),
        deckGraphs: graphs.makeGraphs(stats.getDeckStats(deck.cards)),
        })
  }

  const getDeckById = (query) => {
    query = "/api/get/deck/" + query
    //if query is empty, don't send
    if (query.trim() === "/api/get/deck/") {
      return
    }

    server.post(query).then(response => {
      // localStorage.setItem("TEST_DECK", JSON.stringify(response))
      // console.log(response)
      //if invalid, just direct to search page
      if (response.length === 0) {
        nav('/search/')
      }
      else {
        document.title = response.name
        console.log(response)
        updateState({
          data: response,
          deckStats: stats.getDeckStats(response.cards),
          deckGraphs: graphs.makeGraphs(stats.getDeckStats(response.cards)),
          hasGottenDeck: true
        })
        getUserById("id=" + response.user_id)
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
      commanderSlot: state.data.commander
    }))
    utilities.saveToLocalStorage("wipDeck", gc.wipDeck)
    nav('/deckeditor')
  }

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
        updateState({
          deckAuthor: response[0],
        })
      }
    })

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

  const toggleGraphs = () => {
    updateState({
      showRawGraphs: !state.showRawGraphs
    })
  }

  const makeDecklist = (deck) => {
    let unique = makeUniqueDeck(deck)
    let cards = unique.map((item, i) => {
      // return <div>{item.name} x{getCount(item, deck)}</div>
      return <div key={i} style={{marginBottom:"5px"}}><CardObject clickable isCompact={true} count={getCount(item, deck)} data={item}></CardObject></div>
    })
    return (
      <div>
        {cards}
      </div>
    )
  }
  
  const getCount = (card, deck) => {
    return deck.filter((item) => { return item.name === card.name }).length
  }

  const makeUniqueDeck = (deck) => {
    // list of card objects
    let uniqueResults = []
    // list of unique names
    let uniqueNames = []

    uniqueResults = deck.filter((item) => {
      // check if already found that card
      let duplicate = uniqueNames.includes(item.name)
      // if not found yet, add it to the list
      if (!duplicate) {
        uniqueNames.push(item.name)
        return true;
      }
      return false;
    })

    return uniqueResults
  }

  const toggleDescription = () => {
    updateState({
      showFullDescription: !state.showFullDescription
    })
  }

  return (
    <div className={`DeckPage ${darkMode ? "DeckPageDark" : ''}`}>
  
      <div className='Container Page'>
        {
          !state.hasGottenDeck && 
          <div className="HeaderText" style={{textAlign:'center'}}>
          Loading...
          {/* <img src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif"/> */}
          </div>
        }
        { state.hasGottenDeck &&
          <div className="DeckPageContent">
          <div className="DeckPageBanner" style={{backgroundImage: "url(" + state.data.cover_art + ")"}}>
          {/* <div className="DeckPageBanner" style={{backgroundImage: ""}}> */}
          <div className="blur"/>
          <div className="DeckInfoContent">
          {/* <div className="DeckPageBanner" style={{background: "url(" + "" + ")"}}> */}
              <div className="DeckPage-Buttons">
              
                {
                  gc.activeSession &&
                  <input type="button" style={{float: 'right', marginRight: '20px', marginTop: '10px'}} className='FancyButton' onClick={copyDeck} value={(gc.activeSession != null && gc.activeSession.user.id === state.data.user_id) ? "Edit Deck" : "Copy Deck"} />
                }
                
                {/* <input type="button" style={{float: 'right', marginRight: '20px', marginTop: '10px'}}  className='FancyButton' id="alt" onClick={toggleGraphs} value={state.showRawGraphs ? "Hide Graphs" : "Show Graphs"} /> */}
          
                {
                  gc.activeSession &&
                  <div onClick={() => {
                    toggleFavorite()
                    }}
                    style={{float: 'right', marginRight: '20px', marginTop: '10px', cursor:'pointer'}}
                    >
                  
                  { state.isFavorited &&
                    <div className="FavoriteIcon" id="isFavorited">-</div> ||
                    <div className="FavoriteIcon" id="notFavorited">+</div>
                  }
                    </div>
                }   
                
              </div>
              { state.data.user_id && <Link to={"/user/?id=" + state.data.user_id}> 
              <div className="SubHeaderText" id="typeLine" title="Author" style={{marginBottom: "4px", color:"#f7f7f7", fontStyle:"normal"}}> 
                
                {/* { 
                  state.deckAuthor && 
                  <UserObject data={state.deckAuthor}/>
                } */}
                {state.data.user_name}
              </div>
              </Link>
              }
             <div className="HeaderText" id="cardName" style={{fontSize: '48px', marginTop: "-5px"}}> 
              {
                !state.data.isValid && 
                <div className="CardError" title="Deck not valid" style={{fontSize: "32px", height: "40px", width: "40px", top:"48px", marginTop: "-45px", left:"-50px", position:"relative"}}>!</div>
                
              }
                  {state.data.name}
                </div>
             
              <div className="SubHeaderText" style={{marginTop: "0px"}}> 
                { utilities.getProperFormatName(state.data.format)}
              </div>
              
              
              <div className="SubHeaderText"> 
                {/* <div className="DeckValidity" style={{color: state.data.isValid ? "black" : "red"}}>{state.data.cards.length > 0 && (state.data.isValid ? "" : "This deck is not legal!")}</div> */}
              </div>
              <div className="SubHeaderText" style={{marginTop: '10px', fontSize: '16px', color:"black", textShadow: "none", marginBottom:"20px"}}> 
                {state.data.tags != undefined ? (<TagList tags={state.data.tags} />) : (<></>)}
                
              </div>
             
              
              {/* <div className="BodyText" style={{whiteSpace:"pre-line"}} onClick={() => {
                toggleDescription()
              }}> 
                { state.showFullDescription ? 
                  <div>
                    { state.data.description.slice(0,800) }
                  </div> 
                  : <div>
                    { state.data.description.slice(0,400) }
                  </div>
                }
              </div>  */}
              
              <div className="BodyText" style={{whiteSpace:"pre-line"}}>
                    { state.data.description.slice(0,800) }
                    { state.data.description.length > 800 && "..."}
              </div> 
              
          
          </div>
          </div>
          <div className="DeckPageGroup" style={{marginBottom: "100px"}}> 
                  {/* <b className='HeaderText'>Decklist:</b>
                  <br></br> */}
                  { makeDecklist(state.data.cards) }
          </div> 
          <div className="DeckPageGroup" style={{marginBottom: "200px"}}> 
                  {/* <b className='HeaderText'>Deck Info:</b>
                  <br></br> */}
                  <div style={{display:"inline-block"}}>
                  <b className='BodyText'>Mana Curve</b>
                  <br></br>
                  <br></br>
                  {state.deckGraphs["mana_curve"]}</div>
                  <div style={{display:"inline-block"}}>
                  <b className='BodyText'>Color Distribution</b>
                  <br></br>
                  <br></br>
                  {state.deckGraphs["mana_ratio"]}</div>
                  <div style={{display:"inline-block"}}>
                  <b className='BodyText'>Card Types</b>
                  <br></br>
                  <br></br>
                  {state.deckGraphs["card_types_counts"]}</div>
          </div>
        </div>
        } 
      </div>
       
      {/* <div style={{ display: 'flex', flexFlow: 'column nowrap', margin: 'auto', alignItems: 'center', minWidth: '300px', maxWidth: '60%' }}> */}
     
        {/* <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', alignItems: 'center', margin: '40px 8px 0 8px', justifyContent: 'space-between' }}>
          <div>
            <input type="button" className='FancyButton' id="alt" onClick={copyURLToClipboard} value={state.shared ? "Shareable Link Copied" : "Get Shareable Link"} />
            <input type="button" className='FancyButton' id="alt" onClick={toggleGraphs} value={state.showRawGraphs ? "Hide Graphs" : "Show Graphs"} />
          
          </div>
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
        </div> */}
        
        {/* <div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center", width: "100%", gap: "16px" }}>
          {state.viewMode === "Spread" ? <>
            {state.data.cards.map((card, i) =>
              <div style={{ margin: '10px', display: 'inline-block' }} key={i}><CardObject data={card} isCompact={state.compactView} clickable /></div>
            )}
          </> : <></>}
          {state.viewMode === "Stacked" ? <CardStack cards={state.data.cards} isCompact={state.compactView} /> : <></>}
          {state.viewMode === "Categorized" ? <>
            {utilities.mapCardsToTypes(state.data.cards).map((typeList, i) => (
              <CardStack key={i} cards={typeList.cards} label={typeList.type} isCompact={state.compactView} />
            ))}
          </> : <></>}
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default Deck;