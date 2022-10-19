import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject';
import { GlobalContext } from "../context/GlobalContext";
import * as server from "../functions/ServerTalk";
import Footer from '../components/Footer/Footer';
import './Deck-Editor.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TagList from '../components/TagList/TagList';

const DeckEditor = (props) => {
  const [state, setState] = useState({
    cards: [],
    tagInput: ""
  })
  const gc = useContext(GlobalContext)
  const { hasSearchBar, setSearchBar } = useContext(GlobalContext);
  const { wipDeck, setWipDeck } = useContext(GlobalContext);

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
    document.title = "Deck Editor"

    setState((previous) => ({
      ...previous,
      cards: wipDeck.cards
    }))
  }, [gc])

  const handleChanges = (event) => {
    setWipDeck((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }))
  }
  const updateWipDeck = (objectToUpdate) => {
    setWipDeck((previous) => ({
      ...previous,
      ...objectToUpdate
    }))
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
  const clearDeck = (event) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to clear this deck?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => (gc.setWipDeck({
            authorID: "",
            cards: [],
            coverCard: "",
            deckID: "",
            description: "",
            formatTag: "",
            tags: [],
            title: ""
          }))
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
  }
  return (
    <div className='Page'>
      <form>
        <input type="text" name="title" value={wipDeck.title} onChange={handleChanges} placeholder="Deck Name" />
        <input type="text" name="description" value={wipDeck.description} onChange={handleChanges} placeholder="Deck Description" />
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
        <input type="text" name="tagInput" value={state.tagInput} onChange={handleStateChanges} onKeyDown={handleKeyDown} placeholder="Add Tag" />
        {/* TODO:: make tags deletable lmao */}
        <TagList tags={wipDeck.tags} handleDeleteTag={handleDeleteTag} editMode={true}/>
        <input type="button" onClick={handleSubmit} value="Save Deck" />
        <input type="button" onClick={clearDeck} value="Clear Deck" />

      </form>
      {state.cards.map((card, index) => (
        <CardObject data={card} />
      ))}
      {wipDeck.coverCard != "" ? <>Cover card:<CardObject data={wipDeck.coverCard} /> </> : <></>}
      <Footer />
    </div>
  )
}

export default DeckEditor
