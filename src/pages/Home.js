import { useNavigate } from 'react-router-dom';
import './Home.css'
import './GlobalStyles.css'
import { React, useEffect, useState, useContext } from 'react';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject.js';
import { GlobalContext } from '../context/GlobalContext.js';
import SearchBar from '../components/SearchBar/SearchBar.js';

const Home = (props) => {

  const [state, setState] = useState({
    bgImageUrl: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092"
  })
  
  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);
  const {searchQuery, setSearchQuery} = useContext(GlobalContext);
  const {searchType, setSearchType} = useContext(GlobalContext);
  const nav = useNavigate()

  useEffect(()=>{
    setSearchBar(false)
    // getRandomBgImg()
  })
  const handleAdvancedClick = () => {
    setSearchType("ADV")
    nav("/search")
  }

  const getRandomBgImg = () =>{
    //get random image
    setState({
      bgImageUrl: ""
    })
  }

  return (
    <div className="Container">
      <div className="SearchContent" style = {{ backgroundImage: 'url(' + state.bgImageUrl + ')'}}>
        <div className="blur"/>
        <div className="SearchBarObject">
          <SearchBar/>
          <button className="FancyButton" onClick={handleAdvancedClick}>Advanced</button>
        </div>
      </div>
      {/* this is all hardcoded, will be dynamic content */}
      <div className="DeckContent">
        <header className="HeaderText">Recent Decks</header>
        <div className="DeckRow">
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/a/b/abff6c81-65a4-48fa-ba8f-580f87b0344a.jpg?1634347351",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97",
          format: "format"
        }}/></span>
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/f/2/f29ba16f-c8fb-42fe-aabf-87089cb214a7.jpg?1662526238",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97",
          format: "format"
        }}/></span>
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/9/e/9e7fb3c0-5159-4d1f-8490-ce4c9a60f567.jpg?1567181307",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97",
          format: "format"
        }}/></span>
        </div>
        
        <div className="DeckRow">
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/d/5/d52868cb-087e-4f91-91bc-455f2e2e7cd7.jpg?1576381464",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97",
          format: "format"
        }}/></span>
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/8/9/89f612d6-7c59-4a7b-a87d-45f789e88ba5.jpg?1660849295",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97",
          format: "format"
        }}/></span>
        <span><DeckTileObject data={{
          cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/0/b/0b8aff2c-1f7b-4507-b914-53f8c4706b3d.jpg?1596259277",
          id: "",
          name: "Deck Test",
          user_name: "noah_is_awesome_97",
          format: "format"
        }}/></span>
        </div>
      </div>
    </div>
  );
};

export default Home;