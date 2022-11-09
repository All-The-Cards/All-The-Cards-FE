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
import * as mana from '../components/TextToMana/TextToMana.js'
import Sparkles from '../images/sparkles.png'

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
    showFullDescription: false,
    priceFormat: "usd",
    activeCard: {},
    sampleHand: [],
    showExportMenu: false
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
          hasGottenDeck: true,
          activeCard: (response.format =="commander" && response.commander) || response.cover_card || response.cards[0],
        
        })
        getUserById("id=" + response.user_id)
        // console.log(response)
        // console.log(utilities.mapCardsToTypes(response))
        drawNewHand(response.cards)
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
      coverCard: state.data.cover_card,
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
  const sortByCMC = (a, b) => {
    if (a.cmc > b.cmc) {
      return 1
    }
    if (a.cmc < b.cmc) {
      return -1
    }
    return 0
  }
  
  const sortByName = (a, b) => {
    if (a.name >= b.name) {
      return 1
    }
    else {
      return -1
    }
  }

  const sortByLand = (a, b) => {
    if (a.type_one.toLowerCase().includes("Land".toLowerCase()) && b.type_one.toLowerCase().includes("Land".toLowerCase())){
      return 0
    }
    if (a.type_one.toLowerCase().includes("Land".toLowerCase())) {
      return 1
    }
    else {
      return -1
    }
  }

  const sortDeckFull = (a,b) => {

  }

  const makeDecklist = (deck) => {
    let unique = makeUniqueDeck(deck)
    // console.log(deck)
    unique = unique.sort(sortByName).sort(sortByCMC)

    //card groups
    let groups = {
      Commander: [],
      Creature: [],
      Planeswalker: [],
      Artifact: [],
      Enchantment: [],
      Instant: [],
      Sorcery: [],
      Land: [],
    }
    let deckCopy = [...unique]

    //fill groups
    //if card in type, push to group, remove from main list
    for (let i = 0; i < Object.keys(groups).length; i++) {
      // console.log(Object.keys(groups)[i])
      if (state.data.format == "commander" && groups["Commander"].length < 1){
        for (let k = 0; k < deckCopy.length; k++){
            if (deckCopy[k].name == state.data.commander.name){
              groups["Commander"].push(deckCopy[k])
              deckCopy.splice(k--, 1)
            }
          }
        }
      for (let k = 0; k < deckCopy.length; k++){
        
        if (deckCopy[k].type_one.toLowerCase().includes("land".toLowerCase())){
          // console.log(deckCopy[k])
          groups["Land"].push(deckCopy[k])
          deckCopy.splice(k--, 1)
        }
        else if (deckCopy[k].type_one.toLowerCase().includes("creature".toLowerCase())){
          // console.log(deckCopy[k])
          groups["Creature"].push(deckCopy[k])
          deckCopy.splice(k--, 1)
        }
        else if (deckCopy[k].type_one.toLowerCase().includes(Object.keys(groups)[i].toLowerCase())){
          // console.log(deckCopy[k])
          groups[Object.keys(groups)[i]].push(deckCopy[k])
          deckCopy.splice(k--, 1)
        } 
      }
    }
    
    //sort groups    
    for (let i = 0; i < Object.keys(groups).length; i++) {
      groups[Object.keys(groups)[i]] = groups[Object.keys(groups)[i]].sort(sortByName).sort(sortByCMC)
    }
    let groupCards = structuredClone(groups)
    // console.log(groups)
    // map group items to cardobjects
    for (let i = 0; i < Object.keys(groups).length; i++) {
      for (let k = 0; k < Object.values(groups)[i].length; k++) {
        let currentCard = groupCards[Object.keys(groups)[i]][k]
        // console.log(currentCard)
        // console.log("HERE:", currentCard)
        if (currentCard.type !== "div"){
        groups[Object.keys(groups)[i]][k] = <div
        key={i * 100 + k + 1}
        style={{
          marginBottom:"6px"
        }}
        onMouseEnter={() => {
          // updateState({activeCard: groupCards[Object.keys(groups)[i]][k]})
          updateState({activeCard: groupCards[Object.keys(groups)[i]][k]})
        }}>
        <CardObject key={k + 100} isCompact={true} clickable count={getCount(currentCard, deck)} disableHover data={currentCard}/>
    
      </div>}
      
      }
      // groups[Object.keys(groups)[i]] = <CardObject isCompact={true} clickable count={getCount(unique, groups[Object.keys(groups)[i]])} disableHover data={groups[Object.keys(groups)[i]]}/>
    }
    // divs to groups, if group.length > 0
    for (let i = 0; i < Object.values(groups).length; i++) {
      // console.log(groups[Object.keys(groups)[i]])
      if (groups[Object.keys(groups)[i]].length > 0){
        //get count of all cards in group
        let groupCount = groups[Object.keys(groups)[i]].length
        let totalCards = 0
        for (let k = 0; k < groupCount; k++){
          let currentCard = groupCards[Object.keys(groups)[i]][k]
          totalCards += getCount(currentCard, deck)
        }

        groups[Object.keys(groups)[i]].unshift(<div key={i} style={{marginTop:"10px", marginBottom:"5px"}}>
          {/* {Object.keys(groups)[i] !== "Commander" &&  */}
            <div style={{position:'relative', top:'-2px', display:"inline-block"}}>
              {mana.replaceSymbols("{" + Object.keys(groups)[i].toUpperCase() + "}")}
            {/* </div>} {Object.keys(groups)[i]} {Object.keys(groups)[i] !== "Commander" && " - " + totalCards} */}
            </div> {Object.keys(groups)[i]} {Object.keys(groups)[i] !== "Commander" && " - " + totalCards}
        </div>)
      }
    }
    // console.log(groups["Artifact"])
    
    let cards = []
    for (let i = 0; i < Object.keys(groups).length; i++) {
      if (i == 0) {
        cards.push(<div key={i} className="groupedCards" >{Object.values(groups)[0]}<div style={{height:"1px"}}></div>{Object.values(groups)[1]}</div>)
        i++
      }
      else {

        cards.push(<div key={i} className="groupedCards" >{Object.values(groups)[i]}</div>)
      }
      // cards.push(<div key={i} style={{marginLeft: "30px", maxHeight:'400px', overflowY:'scroll', width: '280px'}}>{Object.values(groups)[i]}</div>)
      // for (let k = 0; k < Object.values(groups)[i].length; k++) {
      //   // console.log(Object.values(groups)[i][k])
      //   cards.push(Object.values(groups)[i][k]
      //   )
      // }
    }

    // let cards = Object.keys(groups).map((item, i) => {
    //   // let cardCount = getCount(item, deck)
    //   // return <div>{item.name} x{getCount(item, deck)}</div>
    //   return <div 
    //     key={i} 
    //     style={{
    //       marginBottom:"8px",
    //       marginLeft: "20px"
    //     }}
    //     onMouseEnter={() => {
    //       // updateState({activeCard: item})
    //     }}
    //     >
    //     {/* <CardObject style={{marginTop:'5px'}} clickable disableHover isCompact={true} count={cardCount} data={item}/> */}
    //     {item}
        
    //     </div>
    // })
    // console.log(cards[1])
    return (
      <div className="columns" style={{marginTop:"5px"}}>
        {cards}
      </div>
    )
  }
  
  const getCount = (card, deck) => {
    // console.log(deck)
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

  const togglePriceFormat = () => {
    if (state.priceFormat == "usd") updateState({priceFormat: "tix"})
    else if (state.priceFormat == "tix") updateState({priceFormat: "usd"})
  }

  const drawNewHand = (cards) => {
    // console.log("Drawing new hand!")
    let fullDeck = [...cards]
    if (state.data.format == 'commander') {
      fullDeck = fullDeck.filter((item) => {
        return item.name !== state.data.commander.name
      })
    }
    let shuffledDeck = []

    for (let i = 0; i < fullDeck.length; i++){
      let randomIndex = Math.floor(Math.random() * (fullDeck.length))
      // console.log(randomIndex, i)
      shuffledDeck.push(fullDeck[randomIndex])
      fullDeck.splice(randomIndex, 1)
    }

    // console.log(shuffledDeck)
    let sample = shuffledDeck.slice(0,7)
    // let sample = shuffledDeck.slice(0,7)
    updateState({sampleHand: sample})
    return sample
  }

  const showExportMenu = () => {
    updateState({showExportMenu: !state.showExportMenu})
  }

  const exportDecklist = (format) => {

    let list = ""
    let uniqueDeck = makeUniqueDeck(state.data.cards)

    if (format == "basic") {
      for (let i = 0; i < uniqueDeck.length; i++){
        let card = uniqueDeck[i]
        list += getCount(card, state.data.cards) + " " + card.name.split("/")[0] + "\n"
      }
    }
    if (format == "tcgplayer") {
      for (let i = 0; i < uniqueDeck.length; i++){
        let card = uniqueDeck[i]
        list += getCount(card, state.data.cards) + " " + card.name.split("/")[0] + " [" + card.set_shorthand.toUpperCase() + "]" + "\n"
        // list += getCount(card, state.data.cards) + " " + card.name.split("/")[0] + " [" + card.set_shorthand.toUpperCase() + "]" + " " + card.collector_number + "\n"
      }
    }

    navigator.clipboard.writeText(list)
    updateState({showExportMenu: false})
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
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  float: 'right'
                  }}>
                <input type="button" style={{float: 'right', marginRight: '20px', marginTop: '10px'}} id='alt' className='FancyButton' onClick={showExportMenu} value={"Export Deck"} />
                { state.showExportMenu && <div>
                        <div className="UserMenu" style={{position: 'absolute', color: 'black', textAlign:'left', textShadow:'none', marginLeft:'-10px'}}>
                            <div className="MenuItems" id="ignoreMenuItem">Send to Clipboard...</div>
                            <div className="MenuItems" onClick={() => {exportDecklist("basic")}}>Basic</div>
                            <div className="MenuItems" onClick={() => {exportDecklist("tcgplayer")}}>Advanced</div>
                        </div>
                    </div>
                }
                </div>
                
                {/* <input type="button" style={{float: 'right', marginRight: '20px', marginTop: '10px'}}  className='FancyButton' id="alt" onClick={toggleGraphs} value={state.showRawGraphs ? "Hide Graphs" : "Show Graphs"} /> */}
          
                {
                  gc.activeSession &&
                  <div onClick={() => {
                    toggleFavorite()
                    }}
                    style={{float: 'right', marginRight: '20px', marginTop: '10px', cursor:'pointer'}}
                    >
                  
                  { state.isFavorited &&
                    // <div className="FavoriteIcon" id="isFavorited">-</div> ||
                    // <div className="FavoriteIcon" id="notFavorited">+</div>
                    
                    <img className="FavoriteIcon" title="Remove Favorite" id="isFavorited" src={Sparkles}></img> || 
                    <img className="FavoriteIcon" title="Add Favorite" id="notFavorited" src={Sparkles}></img>
                  }
                  
                    </div>
                }   
                
              </div>
              { state.data.user_id && <div style={{maxWidth:'400px'}}><Link to={"/user/?id=" + state.data.user_id}> 
              <div className="SubHeaderText" id="typeLine" title="Author" style={{marginBottom: "4px", color:"#f7f7f7", fontStyle:"normal"}}> 
                
                {/* { 
                  state.deckAuthor && 
                  <UserObject data={state.deckAuthor}/>
                } */}
                {state.data.user_name}
              </div>
              </Link></div>
              }
             <div className="HeaderText" id="cardName" style={{fontSize: '48px', marginTop: "-5px"}}> 
              {
                !state.data.isValid && 
                <div className="CardError" title="Deck not valid" style={{fontSize: "32px", height: "40px", width: "40px", top:"48px", marginTop: "-45px", left:"-50px", position:"relative"}}>!</div>
                
              }
                  {state.data.name}
                </div>
             
             <div 

              title="Click to toggle price format"
              style={{cursor:"pointer", userSelect:"none"}}
             onClick={() => {
              togglePriceFormat()
             }}>
             {
              state.priceFormat == "usd" &&
              <div  style={{float: 'right', marginRight: '20px', marginTop: '-30px'}}  >
                  Total Price: ${state.deckGraphs["total_prices"].usd}
              </div>
             }
              {
              state.priceFormat == "tix" &&
              <div  style={{float: 'right', marginRight: '20px', marginTop: '-30px'}}  >
                  Total Price: {state.deckGraphs["total_prices"].tix} TIX
              </div>
             }
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
              
              <div className="BodyText" style={{whiteSpace:"pre-line", width: "66%"}}>
                    { state.data.description.slice(0,800) }
                    { state.data.description.length > 800 && "..."}
              </div> 
              
          
          </div>
          </div>


          {/* <div className="DeckPageGroup" style={{marginTop: "20px", background:'#dadada', height:'50px', borderRadius:'10px'}}> 
          Decklist actions - what content will go here? if any
          </div> */}
          <div className="DeckPageGroup" style={{marginBottom: "100px", height: '510px', display:'flex', justifyContent:'left', marginTop:'50px'}}> 
          
                  {/* <b className='HeaderText'>Decklist:</b>
                  <br></br> */}
                  <div style={{marginRight:'50px', display:"inline-block", height: '100%'}}>
                    <div style={{textAlign:'center'}} className="RegularCard">
                    <CardObject clickable data={state.activeCard}/>
                    <div className="itemPrices">
                      {state.activeCard.name} - {state.activeCard.set_shorthand.toUpperCase()}
                      <br></br>
                      <br></br>
                    {
                      ((state.activeCard.prices.usd && !state.activeCard.type_one.toLowerCase().includes("basic")) && "$" + (parseFloat(state.activeCard.prices.usd)).toFixed(2) || "")
                    }

                    {
                      state.activeCard.tcgplayer_id && 
                      <div> 
                        <a href={"https://www.tcgplayer.com/product/" + state.activeCard.tcgplayer_id}>
                        <i style={{color:"#7138D1"}}>View on TCGPlayer</i>
                        </a>
                      </div>
                    }
                    
                    <br></br>
                    {
                      ((state.activeCard.prices.tix && !state.activeCard.type_one.toLowerCase().includes("basic")) && (parseFloat(state.activeCard.prices.tix)).toFixed(2) + " TIX" || "")
                      } 
                    {
                      state.activeCard.mtgo_id && 
                      <div>
                        <a href={"https://www.cardhoarder.com/cards/" + state.activeCard.mtgo_id}>
                        <i style={{color:"#7138D1"}}>View on Cardhoarder</i> 
                        </a>
                        <br></br>
                      </div>
                    }
                    </div>
                    </div>
                  </div>
                  
                  <div style={{display:"inline-block", textAlign:'left'}}>
                  { makeDecklist(state.data.cards) }
                  </div>
          </div> 


          <div className="DeckPageGroup" style={{marginBottom: "100px"}}> 
            <div className='HeaderText' style={{marginBottom: '30px'}}>Deck Breakdown</div>
                  {/* <b className='HeaderText'>Deck Info:</b>
                  <br></br> */}
                  {/* <b className='BodyText'>Deck Stats:</b>
                    <br></br>
                  <div style={{display:"inline-block"}}>
                  Avg. CMC: {state.deckGraphs["avg_cmc"]}
                  </div> 
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
          <div className="DeckPageGroup" style={{marginBottom: "200px"}}> 
                    
            
          <div className='HeaderText' style={{marginBottom: '30px'}}>Sample Hand
            <input type="button" style={{position: 'relative', top:'-6px', marginLeft:'40px'}} className='FancyButton' id='alt' onClick={() => {drawNewHand(state.data.cards)}} value={"Redraw"} /></div>
            { state.sampleHand && <div>
              <div style={{marginLeft: '-100px'}}>
              { state.sampleHand.map((item, i) => {
                return <div key={i} className='RegularCard' id="stackedCards" style={{marginRight: '-100px'}}><CardObject data={item}/></div>
              })}</div>
              </div>}
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