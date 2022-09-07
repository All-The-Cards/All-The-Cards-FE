import { React, useEffect, useState, useContext } from 'react';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject.js';
import { GlobalContext } from '../context/GlobalContext.js';
import SearchBar from '../components/SearchBar/SearchBar.js';
import env from "react-dotenv";

const Home = (props) => {

  const [state, setState] = useState({
    
  })

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

  useEffect(()=>{

    setSearchBar(false)
      
  },[])
  
  return (
    <div>
      <header>Welcome to All The Cards</header>
      <div>
        <SearchBar type="global"/>
      </div>
    </div>
  );
  };

export default Home;