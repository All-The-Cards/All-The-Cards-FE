import { React, useState, useEffect, useContext } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import { GlobalContext } from "../context/GlobalContext";

const Home = (props) => {

  const [state, setState] = useState({
    
  })

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

  useEffect(() => {
    setSearchBar(props.hasSearchBar)
  }, [])

  return (
    <div>
      <header>Welcome to All The Cards</header>
      <div>
        <SearchBar/>
      </div>
    </div>
  );
  };

export default Home;