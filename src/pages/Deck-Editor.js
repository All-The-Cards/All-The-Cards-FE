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
  
  return (

    <div>
        {wipDeck.title}
        {wipDeck.description}
        {wipDeck.cards.map((card, index) => (
          <CardObject data={card}/>
        ))}
    </div>

  )}

export default DeckEditor
