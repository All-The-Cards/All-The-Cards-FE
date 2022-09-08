import { useNavigate } from 'react-router-dom';
import './Home.css'
import { React, useEffect, useState, useContext } from 'react';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject.js';
import { GlobalContext } from '../context/GlobalContext.js';
import SearchBar from '../components/SearchBar/SearchBar.js';

const Home = (props) => {

  const [state, setState] = useState({

  })
  
  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

  useEffect(()=>{
    setSearchBar(false)
  })
  const handleAdvancedClick = () => {
    console.log("advanced click")
  }

  return (
    <div className="HomeContainer">
      <div className="SearchContent">
        <div className="blur"/>
        <div className="SearchBarObject">
          <SearchBar/>
          {/* <button class="FancyButton" id="alt">Advanced</button> */}
          <button className="FancyButton" onClick={handleAdvancedClick}>Advanced</button>
        </div>
      </div>
      <div className="DeckContent">
        <header className="HeaderText">Recent Decks</header>
        <div className="DeckRow">
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97"
        }}/></span>
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97"
        }}/></span>
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97"
        }}/></span>
        </div>
        
        <div className="DeckRow">
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/d/5/d52868cb-087e-4f91-91bc-455f2e2e7cd7.jpg?1576381464",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97"
        }}/></span>
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/d/5/d52868cb-087e-4f91-91bc-455f2e2e7cd7.jpg?1576381464",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97"
        }}/></span>
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/d/5/d52868cb-087e-4f91-91bc-455f2e2e7cd7.jpg?1576381464",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97"
        }}/></span>
        </div>
      </div>
    </div>
  );
};

export default Home;