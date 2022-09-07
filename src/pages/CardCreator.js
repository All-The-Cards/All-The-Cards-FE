import { React, useState, useEffect, useContext } from 'react';
import { GlobalContext } from "../context/GlobalContext";

const CardCreator = (props) => {

  const [state, setState] = useState({
    
  })

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

  useEffect(() => {
    setSearchBar(props.hasSearchBar)
  }, [])
  

  return (

    <div>
        CardCreator
    </div>

  )}

export default CardCreator