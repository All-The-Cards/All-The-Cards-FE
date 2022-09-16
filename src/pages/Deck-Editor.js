import { React, useState, useEffect, useContext } from 'react';
import { GlobalContext } from "../context/GlobalContext";

const DeckEditor = (props) => {

  const [state, setState] = useState({
    
  })

  const gc = useContext(GlobalContext)

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
  }, [])
  
  return (

    <div>
        DeckEditor
    </div>

  )}

export default DeckEditor
