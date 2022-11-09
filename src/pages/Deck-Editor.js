import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject';
import { GlobalContext } from "../context/GlobalContext";
import * as server from "../functions/ServerTalk";
import * as utilities from '../functions/Utilities.js';
import * as stats from '../functions/Stats.js';
import * as graphs from '../functions/Graphs.js';
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
        deckID: "",
        description: "",
        formatTag: "",
        tags: [],
        title: "",
        commanderSlot: {
          name: ""
      },
      coverCard: {
        image_uris: {
          art_crop: ""
        }
      },
      isValid: false,
      })
    }
    if (gc.wipDeck.commanderSlot === undefined) {
        updateWipDeck({commanderSlot: {
          name: ""
      },})
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
    let result = { ...wipDeck, cards: [], coverCard: wipDeck.coverCard.id, commander: wipDeck.commanderSlot.id, isValid: wipDeck.isValid }
    if (result.coverCard === undefined) {
      result.coverCard = wipDeck.cards[0].id
    }
    if (result.commander === undefined) {
      result.commander = ""
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
              art_crop: ""
            }
          },
          deckID: "",
          description: "",
          formatTag: "",
          tags: [],
          title: "",
          commanderSlot: {
            name: ""
          },
          isValid: false,
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
      title: 'New Deck',
      message: 'Are you sure you want to start a new deck? Your changes won\'t be saved.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            gc.setWipDeck({
              authorID: "",
              cards: [],
              deckID: "",
              description: "",
              formatTag: "",
              tags: [],
              title: "",
              commanderSlot: {
                  name: ""
              },
              coverCard: {
                image_uris: {
                  art_crop: ""
                }
              },
              isValid: false,
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

  const deleteDeck = (event) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to PERMANENTLY DELETE this deck? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            //CLEAR LOCAL
            // gc.setWipDeck({
            //   authorID: "",
            //   cards: [],
            //   deckID: "",
            //   description: "",
            //   formatTag: "",
            //   tags: [],
            //   title: "",
            //   commanderSlot: {
            //       name: ""
            //   },
            //   coverCard: {
            //     image_uris: {
            //       art_crop: ""
            //     }
            //   },
            //   isValid: false,
            // })
            // saveToLocalStorage("wipDeck", gc.wipDeck)
            
            //SEND DELETE REQUEST
            //.then(nav("/"))
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
                  art_crop: ""
                }
              },
              deckID: "",
              description: "",
              formatTag: "",
              tags: [],
              title: "",
              commanderSlot: {
                name: ""
            },
            isValid: false,
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
    <div className='Container Page'>
      { state.publishBlocker && <div className='PublishBlocker'>
        <div className="PublishText">
          Publishing...
          <br></br>
            <img style={{width: '50px'}}src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif"/>
          </div>
        </div> }
          <div className="DeckPageContent">
      <div className="DeckPageBanner" style={{backgroundImage: "url(" + gc.wipDeck.coverCard.image_uris.art_crop + ")"}}>
          {/* <div className="DeckPageBanner" style={{backgroundImage: ""}}> */}
          <div className="blur"/>
          <div className="DeckInfoContent">
          {/* <div className="DeckPageBanner" style={{background: "url(" + "" + ")"}}> */}
              <div className="DeckPage-Buttons">
              
              <button className="FancyButton" id='alt' style={{float:'right', marginLeft:'20px'}} onClick={(event) => {
                let msg = 'Are you sure you want to upload your deck?'
                if (!gc.wipDeck.isValid) msg += " It looks like your deck isn't legal. You can still upload it, and there will be a warning tag."
                confirmAlert({
                  title: 'Publish Deck',
                  message: msg,
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: (() => {
                        
                        handleSubmitRedirect(event)
                      })
                    }, {
                      label: 'No',
                      onClick: null
                    }
                  ]
                })
            
                // handleSubmitRedirect(event)
                // gc.setIsEditing(false)
                // gc.setWipDeck(null)
                // nav("/")

              }}>Publish Deck</button>
              <button className="FancyButton" style={{float:'right'}} onClick={cancelEditingDeck}>Quit</button>
              <button className="FancyButton" style={{float:'right'}} onClick={handleSubmit} value="Save Deck" >Save</button>
              <button className="FancyButton" style={{float:'right'}} onClick={clearDeck} value="New Deck" >New Deck</button>
              <button className="FancyButton" id='alt2' style={{float:'right'}} onClick={deleteDeck}>Delete</button>
                
              </div>
             <div className="HeaderText" id="cardName" style={{fontSize: '48px', marginTop: "-5px"}}> 
                 {/* {gc.wipDeck.title} */}
              <input type="text" name="title" className='styledInput' value={wipDeck.title} onChange={handleChanges} placeholder="Deck Name" style={{ fontSize: '48px', fontWeight:'bold'}} />
              </div>
             
              <div 
              className='styledInput' style={{marginTop: "10px", width:'210px'}}> 
              <select
              className='styledInput'
              style={{borderRadius:'20px', background:'0', padding:'0'}}
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
              
              
              <div className="SubHeaderText"> 
                {/* <div className="DeckValidity" style={{color: state.data.isValid ? "black" : "red"}}>{state.data.cards.length > 0 && (state.data.isValid ? "" : "This deck is not legal!")}</div> */}
              </div>
              <div className="SubHeaderText" style={{marginTop: '10px', fontSize: '16px', color:"black", textShadow: "none", marginBottom:"20px"}}> 
              <input type="text" name="tagInput" 
              className='styledInput' value={state.tagInput} onChange={handleStateChanges} onKeyDown={handleKeyDown} placeholder="Add Tag..." style={{marginRight:'20px'}}/>
            <TagList tags={wipDeck.tags} handleDeleteTag={handleDeleteTag} editMode={true} />
                
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
              
              <div className="BodyText" style={{whiteSpace:"pre-line", width: "50%"}}>
              <textarea rows="4" type="text"
              className='styledInput'  name="description" value={wipDeck.description} onChange={handleChanges} multiline placeholder="Deck Description" style={{ width: '100%' }} />
              </div> 
              
          
          </div>
          </div>

        {/* <form style={{ display: 'flex', flexFlow: 'column nowrap', margin: 'auto', alignItems: 'center', }}>
          <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', alignItems: 'center', margin: '40px 8px 0 8px', justifyContent: 'space-between' }}>
            <div>
              <input type="text" name="title" value={wipDeck.title} onChange={handleChanges} placeholder="Deck Name" style={{ fontSize: '2rem' }} />
              
              <div className="DeckValidity" style={{color: gc.wipDeck.isValid ? "black" : "red"}}>{gc.wipDeck.isValid ? "" : "Error!"}</div>
              <input type="button" className="FancyButton" onClick={handleSubmit} value="Save Deck" />
              <input type="button" className="FancyButton" onClick={clearDeck} value="Clear Deck" />
              <input type="button" className="FancyButton" onClick={(event) => {
                let msg = 'Are you sure you want to upload your deck?'
                if (!gc.wipDeck.isValid) msg += " It looks like your deck isn't legal. You can still upload it, and there will be a warning tag."
                confirmAlert({
                  title: 'Publish Deck',
                  message: msg,
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: (() => {
                        
                        handleSubmitRedirect(event)
                      })
                    }, {
                      label: 'No',
                      onClick: null
                    }
                  ]
                })
            
                // handleSubmitRedirect(event)
                // gc.setIsEditing(false)
                // gc.setWipDeck(null)
                // nav("/")

              }} value="Publish Deck" />
              <input type="button" className="FancyButton" onClick={cancelEditingDeck} value="Quit" />
              {/* <input type="button" className='FancyButton' id="alt" onClick={toggleGraphs} value={state.showRawGraphs ? "Hide Graphs" : "Show Graphs"} /> */}
          
            {/* </div>
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

        </form> */}
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
        <div style={{ display: 'flex', flexFlow: 'row wrap', gap: '16px', justifyContent: 'center', marginLeft:'15%', marginRight:'15%', marginBottom:'100px', marginTop:'40px' }}>
          {state.cards.map((card, index) => (
            <CardObject size={"RegularCard"} key={index} data={card} clickable/>
          ))}
        </div>

        {/* {(wipDeck.coverCard !== null) ? <>Cover card:<CardObject data={wipDeck.coverCard} /> </> : <></>} */}
      </div>
    </div>
  )
}

export default DeckEditor
