import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject';
import { GlobalContext } from "../context/GlobalContext";

const DeckEditor = (props) => {

  const [state, setState] = useState({
    cards: []
  })

  const gc = useContext(GlobalContext)
  const { hasSearchBar, setSearchBar } = useContext(GlobalContext);
  const { wipDeck, setWipDeck } = useContext(GlobalContext);

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
    setState((previous) => ({
      ...previous,
      cards: wipDeck.cards
    }), [])
    console.log("asldkfjasdfkldskafkl")
  })
  const handleChanges = (event) => {
    setWipDeck((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <div>
      <form>
        <input type="text" name="title" value={wipDeck.title} onChange={handleChanges} placeholder="Deck Name" />
        <input type="text" name="description" value={wipDeck.description} onChange={handleChanges} placeholder="Deck Description" />
      </form>
      {state.cards.map((card, index) => (
        <CardObject data={card} />
      ))}
    </div>
  )
}

export default DeckEditor
