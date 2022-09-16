import { React, useState, useEffect, useContext } from 'react';
import { GlobalContext } from "../context/GlobalContext";

const CardCreator = (props) => {

  const [state, setState] = useState({
    
  })

  const gc = useContext(GlobalContext)

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
  }, [])
  

  return (

    <div>
        CardCreator
    </div>

  )}

export default CardCreator