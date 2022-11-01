import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject';
import { GlobalContext } from "../context/GlobalContext";
import * as server from "../functions/ServerTalk";
import * as utilities from '../functions/Utilities.js';
import * as stats from '../functions/Stats.js';
import * as graphs from '../functions/Graphs.js';
import Footer from '../components/Footer/Footer';
import './Deck-Editor.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TagList from '../components/TagList/TagList';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage } from '../functions/Utilities';

const DeckEditor = (props) => {
  const [state, setState] = useState({
    cards: [],
    tagInput: "",
    publishBlocker: false,
    deckStats: {},
    deckGraphs: {},
    showRawGraphs: false
  })
  const nav = useNavigate()
  const gc = useContext(GlobalContext)
  const { hasSearchBar, setSearchBar } = useContext(GlobalContext);
  const { wipDeck, setWipDeck } = useContext(GlobalContext);

  useEffect(() => {
    if (gc.wipDeck === null) {
      gc.setWipDeck({
        authorID: "",
        cards: [],
        coverCard: {
          image_uris: {
            art_crop: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
          }
        },
        deckID: "",
        description: "",
        formatTag: "",
        tags: [],
        title: ""
      })
    }
    setState((previous) => ({
      ...previous,
      deckStats: stats.getDeckStats(wipDeck.cards),
      deckGraphs: graphs.makeGraphs(stats.getDeckStats(wipDeck.cards)),
    }))
  }, [gc.wipDeck])

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
    gc.setIsEditing(true)
    document.title = "Deck Editor"

    setState((previous) => ({
      ...previous,
      cards: wipDeck.cards
    }))
    saveToLocalStorage("wipDeck", wipDeck)
  }, [gc])

  const handleChanges = (event) => {
    setWipDeck((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }))
    saveToLocalStorage("wipDeck", wipDeck)
  }
  const updateWipDeck = (objectToUpdate) => {
    setWipDeck((previous) => ({
      ...previous,
      ...objectToUpdate
    }))
    saveToLocalStorage("wipDeck", wipDeck)
  }
  const handleStateChanges = (event) => {
    setState((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }))
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (event.target.value != "") {
        let tempTags = wipDeck.tags;
        tempTags.push(event.target.value)
        setWipDeck((previous) => ({
          ...previous,
          tags: tempTags
        }))
        saveToLocalStorage("wipDeck", wipDeck)
        setState((previous) => ({
          ...previous,
          tagInput: ""
        }))
      }
    }
  }
  const formatWipDeck = () => {
    let result = { ...wipDeck, cards: [], coverCard: wipDeck.coverCard.id }
    if (result.coverCard === undefined) {
      result.coverCard = wipDeck.cards[0].id
    }
    wipDeck.cards.forEach(card => {
      result.cards.push(card.id)
    });
    return result
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    let deckData = formatWipDeck()
    deckData = {
      ...deckData,
      token: gc.activeSession != null && gc.activeSession.access_token != "" ? gc.activeSession.access_token : "",
      authorID: gc.activeSession != null && gc.activeSession.user.id != null ? gc.activeSession.user.id : "",
    }
    console.log(deckData)
    fetch(server.buildAPIUrl("/api/features/editor/decks"),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deckData)
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
  }

  const handleSubmitRedirect = (event) => {
    event.preventDefault();
    setState((previous) => ({
      ...previous,
      publishBlocker: true
    }))
    let deckData = formatWipDeck()
    deckData = {
      ...deckData,
      token: gc.activeSession != null && gc.activeSession.access_token != "" ? gc.activeSession.access_token : "",
      authorID: gc.activeSession != null && gc.activeSession.user.id != null ? gc.activeSession.user.id : "",
    }
    console.log(deckData)
    fetch(server.buildAPIUrl("/api/features/editor/decks"),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deckData)
      }
    )
      .then((response) => {
        console.log(response);
        setState((previous) => ({
          ...previous,
          publishBlocker: false
        }))
        gc.setIsEditing(false)
        gc.setWipDeck({
          authorID: "",
          cards: [],
          coverCard: {
            image_uris: {
              art_crop: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
            }
          },
          deckID: "",
          description: "",
          formatTag: "",
          tags: [],
          title: ""
        })
        saveToLocalStorage("wipDeck", gc.wipDeck)
        nav("/")
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const clearDeck = (event) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to clear this deck?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            gc.setWipDeck({
              authorID: "",
              cards: [],
              coverCard: {
                image_uris: {
                  art_crop: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
                }
              },
              deckID: "",
              description: "",
              formatTag: "",
              tags: [],
              title: ""
            })
            saveToLocalStorage("wipDeck", gc.wipDeck)
          }
        }, {
          label: 'No',
          onClick: null
        }
      ]
    })

  }
  const cancelEditingDeck = (event) => {
    confirmAlert({
      title: 'Quit without saving',
      message: 'Are you sure you want to quit without saving?',
      buttons: [
        {
          label: 'Yes',
          onClick: (() => {
            gc.setIsEditing(false)
            gc.setWipDeck({
              authorID: "",
              cards: [],
              coverCard: {
                image_uris: {
                  art_crop: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
                }
              },
              deckID: "",
              description: "",
              formatTag: "",
              tags: [],
              title: ""
            })
            saveToLocalStorage("wipDeck", gc.wipDeck)
            nav("/")
          })
        }, {
          label: 'No',
          onClick: null
        }
      ]
    })

  }
  const handleDeleteTag = (tagID) => {
    let newTags = wipDeck.tags
    newTags.splice(tagID, 1)
    setWipDeck((previous) => ({ ...previous, tags: newTags }))
    saveToLocalStorage("wipDeck", wipDeck)
  }

  const toggleGraphs = () => {
    setState((previous) => ({
      ...previous,
      showRawGraphs: !state.showRawGraphs
    }))
  }

  return (
    <div className='Page'>
      { state.publishBlocker && <div className='PublishBlocker'>
        <div className="PublishText">
          Publishing...
          <br></br>
            <img style={{width: '50px'}}src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif"/>
          </div>
        </div> }
      <div style={{ minWidth: '300px', maxWidth: '60%', margin: 'auto' }}>
        <form style={{ display: 'flex', flexFlow: 'column nowrap', margin: 'auto', alignItems: 'center', }}>
          <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', alignItems: 'center', margin: '40px 8px 0 8px', justifyContent: 'space-between' }}>
            <div>
              <input type="text" name="title" value={wipDeck.title} onChange={handleChanges} placeholder="Deck Name" style={{ fontSize: '2rem' }} />
              <input type="button" className="FancyButton" onClick={handleSubmit} value="Save Deck" />
              <input type="button" className="FancyButton" onClick={clearDeck} value="Clear Deck" />
              <input type="button" className="FancyButton" onClick={(event) => {
                handleSubmitRedirect(event)
                // gc.setIsEditing(false)
                // gc.setWipDeck(null)
                // nav("/")

              }} value="Publish Deck" />
              <input type="button" className="FancyButton" onClick={cancelEditingDeck} value="Quit" />
              <input type="button" className='FancyButton' id="alt" onClick={toggleGraphs} value={state.showRawGraphs ? "Hide Graphs" : "Show Graphs"} />
          
            </div>
            <select
              value={wipDeck.formatTag}
              onChange={(event) => { updateWipDeck({ formatTag: event.target.value }) }}
            >
              <option value="">Any Format</option>
              <option value="standard">Standard</option>
              <option value="commander">Commander</option>
              <option value="pioneer">Pioneer</option>
              <option value="explorer">Explorer</option>
              <option value="modern">Modern</option>
              <option value="premodern">Premodern</option>
              <option value="vintage">Vintage</option>
              <option value="legacy">Legacy</option>
              <option value="oldschool">Old School</option>
              <option value="pauper">Pauper</option>
              <option value="historic">Historic</option>
              <option value="alchemy">Alchemy</option>
              <option value="brawl">Brawl</option>
              <option value="paupercommander">Pauper Commander</option>
              <option value="historicbrawl">Historic Brawl</option>
              <option value="penny">Penny Dreadful</option>
              <option value="duel">Duel</option>
              <option value="future">Future</option>
              <option value="gladiator">Gladiator</option>
            </select>
          </div>
          <div style={{ width: '100%' }}>
            <input type="text" name="tagInput" value={state.tagInput} onChange={handleStateChanges} onKeyDown={handleKeyDown} placeholder="Add Tag" />
            <TagList tags={wipDeck.tags} handleDeleteTag={handleDeleteTag} editMode={true} />
          </div>
          <input type="text" name="description" value={wipDeck.description} onChange={handleChanges} placeholder="Deck Description" style={{ width: '100%', margin: '8px 0 0 8px' }} />

        </form>
        <div>
        { 
          state.showRawGraphs && 
          Object.keys(state.deckStats).map((key, index) => {
            return (
              <div key={index}>
              {key} 
              <br></br>
              Stat: 
              <br></br>
              {JSON.stringify(state.deckStats[key], null, '\n')}
              <br></br>
              Graph: 
              <br></br>
              {state.deckGraphs[key]}
              <br></br>
              <br></br>
                {/* {key}: {state.deckStats[key]} */}
              </div>
            )
          })
        }
        </div>
        <div style={{ display: 'flex', flexFlow: 'row wrap', gap: '16px', justifyContent: 'center', margin: '16px 0 0 0' }}>
          {state.cards.map((card, index) => (
            <CardObject key={index} data={card} clickable/>
          ))}
        </div>

        {/* {(wipDeck.coverCard !== null) ? <>Cover card:<CardObject data={wipDeck.coverCard} /> </> : <></>} */}
      </div>
      <Footer />
    </div>
  )
}

export default DeckEditor
