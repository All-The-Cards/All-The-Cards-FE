import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject';
import { GlobalContext } from "../context/GlobalContext";

const DeckEditor = (props) => {

  const [state, setState] = useState({
    
  })

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);
  const {wipDeck, setWipDeck} = useContext(GlobalContext);

  useEffect(() => {
    setSearchBar(props.hasSearchBar)
  }, [])

  const handleChanges = (event) => {
    setWipDeck((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }))
  } 
  
  return (

    <div>
      <form>
        <input type="text" name="title" value={wipDeck.title} onChange={handleChanges} placeholder="Deck Name"/>
        <input type="text" name="description" value={wipDeck.description} onChange={handleChanges} placeholder="Deck Description"/>
      </form>
        {wipDeck.cards.map((card, index) => (
          <CardObject data={card}/>
        ))}
    </div>

  )}

export default DeckEditor
