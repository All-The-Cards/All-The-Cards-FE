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
    showRawGraphs: false,
    showImportMenu: false,
    importList: ""
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
  const sortByRelease = (a, b) => {
    let aDate = new Date(a.released_at)
    let bDate = new Date(b.released_at)
    if (aDate >= bDate) {
      return -1
    }
    else {
      return 1
    }
  }

  const toggleGraphs = () => {
    setState((previous) => ({
      ...previous,
      showRawGraphs: !state.showRawGraphs
    }))
  }

  const importDeckList = () => {
    setState((previous) => ({
      ...previous,
      showImportMenu: true
    }))
  }

  const submitImport = () => {
    setState((previous) => ({
      ...previous,
      showImportMenu: false
    }))

    //clear deck info
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

    let listOfCards = state.importList.split("\n")
    for (let i = 0; i < listOfCards.length; i++){
      if (listOfCards[i] == "") {
        listOfCards.splice(i--, 1)
      }
    }
    // console.log("Raw list:", listOfCards)
    
    let importObjects = []
    for (let i = 0; i < listOfCards.length; i++){
      let entry = listOfCards[i]
      let obj = {
        count: 1,
        name: entry,
        set_id: null
      }

      if (parseInt(entry[0])) {
        obj.count = parseInt(entry.split(" ")[0])
        let entryNoNum = entry.split(" ").splice(1,20).join(" ")
        entry = entryNoNum
      }

      if(entry.includes("[") && entry.includes("]")){
        let entrySet = entry.split("[")[1].split("]")[0]
        obj.set_id = entrySet
        let entryNoSet = entry.split("[")[0]
        entry = entryNoSet
      }

      //remaining should be card name
      obj.name = entry
      importObjects.push(obj)
    }

    let cardResults = []
    for (let i = 0; i < importObjects.length; i++){
      server.post("/api/search/card/query=" + importObjects[i].name).then(response => {
        if (response.length > 0) {
          let res = response

          let englishCards = res.filter((item) => {
            return item.lang === "en"
          })
          res = englishCards

          //sort by release date
          res = res.sort(sortByRelease)

          //get cards that are "real" cards, buildable in a deck
          let legalCards = res.filter((item) => {
            return !Object.values(item.legalities).every(value => value === "not_legal")
          })
          res = legalCards

          //remove art-types 
          const artTypes = ["borderless", "gold", "inverted", "showcase", "extendedart", "etched"]
          let regularCards = res.filter((item) => {
            return !artTypes.some(el => { if (item.border_color) return item.border_color.includes(el) })
              && !artTypes.some(el => { if (item.frame_effects) return item.frame_effects.includes(el) })
              && !artTypes.some(el => { if (item.finishes) return item.finishes.includes(el) })
              && item.promo === "false"
              && item.full_art === "false"
              // && item.digital === "false"
              && item.games !== "['arena']"
              && item.set_shorthand !== "sld"
              && item.set_type !== "masterpiece"
              && item.finishes !== "['foil']"
              && item.set_type !== "spellbook"
          })
          res = regularCards

          //find duplicates, omit from appearing
          let uniqueRes = []
          let uniqueNames = []
          uniqueRes = res.filter((item) => {
            let duplicate = uniqueNames.includes(item.name)
            if (!duplicate) {
              uniqueNames.push(item.name)
              return true;
            }
            return false;
          })
          res = uniqueRes


          // this is deprecated by the above function
          // //remove invalid card types for deckbuilding
          // let invalidTypes = ['vanguard', 'token', 'planar', 'double_faced_token', 'funny', 'art_series']
          // // let invalidTypes = ['vanguard', 'token', 'memorabilia', 'planar', 'double_faced_token', 'funny']
          // let realCardRes = res.filter((item) => {
          //   return !invalidTypes.includes(item.set_type) && !invalidTypes.includes(item.layout)
          // })
          // res = realCardRes

          //remove some technically-duplicate cards
          let noArenaRes = res.filter((item) => {
            return !item.name.includes("A-")
          })
          res = noArenaRes

          if (cardResults.length == 0) {
            updateWipDeck({coverCard: res[0]})
          }
          // console.log(response[0])
          for (let k = 0; k < importObjects[i].count; k++){
            cardResults.push(res[0])
          }
          updateWipDeck({cards: cardResults})
        }
        else {
          console.log("Card not found:", importObjects[i].name)
        }
      })
    }
  }
  
  const cancelImport = () => {

    setState((previous) => ({
      ...previous,
      showImportMenu: false,
      importList: ""
    }))
  }
  const updateImportList = (e) => {
    setState((previous) => ({
      ...previous,
      importList: e.target.value
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
        { state.showImportMenu && <div className='PublishBlocker'>
          <div className="importMenu">
            <div className="HeaderText" style={{position: 'relative', top: '20px', left: '20px'}}>Import Decklist</div>
            <div className="BodyText" style={{position: 'relative', top: '15px', left: '20px', color:'#bbbbbb', fontStyle:"italic"}}>Accepted formats: "4 Arclight Phoenix", "4 Arclight Phoenix [GRN]"</div>
          <textarea rows="4" type="text"
              className='styledInput importList'  name="importList" value={state.importList} onChange={updateImportList} multiline
              placeholder="Enter a decklist here..." 
              style={{color:'black'}}/>
              <br></br>
              <button className="FancyButton" style={{float:'right', marginRight: '20px'}} onClick={submitImport}>Import List</button>
              <button className="FancyButton" style={{float:'right', marginRight: '20px'}} id='alt' onClick={cancelImport}>Cancel</button>
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
              <button className="FancyButton" style={{float:'right'}} id='disabled' onClick={importDeckList}>Import List</button>
              <button className="FancyButton" style={{float:'right'}} onClick={clearDeck} value="New Deck" >New Deck</button>
              <button className="FancyButton" id='disabled' style={{float:'right'}} onClick={deleteDeck}>Delete</button>
                
              </div>
             <div className="HeaderText" id="cardName" style={{fontSize: '48px', marginTop: "-5px"}}> 
                 {/* {gc.wipDeck.title} */}{
                !gc.wipDeck.isValid && 
                <div className="CardError" title="Deck not valid" style={{fontSize: "32px", height: "40px", width: "40px", top:"55px", marginTop: "-45px", left:"-50px", position:"relative"}}>!</div>
                
              }
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
              <input type="button" className='FancyButton' onClick={toggleGraphs} style={{float:'right'}} value={state.showRawGraphs ? "Hide Details" : "Show Details"} />
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
        {/* <div>
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
              {/* </div>
            )
          })
        }
        </div> */} 
        {
          state.deckGraphs && state.showRawGraphs &&
          <div className="DeckPageGroup" style={{marginBottom: "10px", marginTop: "40px"}}> 
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
        }
        <div style={{ display: 'flex', flexFlow: 'row wrap', gap: '16px', justifyContent: 'center', marginLeft:'15%', marginRight:'15%', marginBottom:'100px', marginTop:'40px' }}>
          {state.cards.filter((item) => { 
                        // console.log(item)
                        return !item.type_one.toLowerCase().includes("land")
                      }).sort(sortByName).sort(sortByCMC).map((card, index) => (
            <CardObject size={"RegularCard"} key={index} data={card} clickable/>
          ))}
          {state.cards.filter((item) => { 
                        // console.log(item)
                        return item.type_one.toLowerCase().includes("land")
                      }).sort(sortByName).sort(sortByCMC).map((card, index) => (
            <CardObject size={"RegularCard"} key={index} data={card} clickable/>
          ))}
        </div>

        {/* {(wipDeck.coverCard !== null) ? <>Cover card:<CardObject data={wipDeck.coverCard} /> </> : <></>} */}
      </div>
    </div>
  )
}

export default DeckEditor
