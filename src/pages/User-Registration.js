import { React, useState, useEffect, useContext } from 'react';
import { GlobalContext } from "../context/GlobalContext";

const Registration = (props) => {

  const [state, setState] = useState({
    
  })

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

  useEffect(() => {
    setSearchBar(props.hasSearchBar)
  }, [])
  return (

    <div>
        Registration
    </div>

  )}

export default Registration