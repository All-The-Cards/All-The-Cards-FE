import { useNavigate } from 'react-router-dom';
import './Home.css'
import './GlobalStyles.css'
import { React, useEffect, useState, useContext } from 'react';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject.js';
import { GlobalContext } from '../context/GlobalContext.js';
import SearchBar from '../components/SearchBar/SearchBar.js';
import * as server from '../functions/ServerTalk.js';

const Home = (props) => {

  const [state, setState] = useState({
    bgImageUrl: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092",
    // bgImageUrl: "",
    recentDecks: []
  })

  const gc = useContext(GlobalContext)

  const nav = useNavigate()

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
    document.title = "All The Cards"
    // getRandomBgImg()
    getRecentDecks()

      // console.log(gc.wipDeck)
  }, [])

  const updateState = (objectToUpdate) => {
    setState((previous) => ({
      ...previous,
      ...objectToUpdate
    }))
  }
  const handleAdvancedClick = () => {
    gc.setSearchType("ADV")
    nav("/search/?adv=true/")
  }

  const getRandomBgImg = () => {
    //get random image
    server.post("/api/features/random/art").then(response => {
      let res = response
      // console.log(res) 
      updateState({ bgImageUrl: res.randomArt })
      return res.randomArt
    })
  }

  const getRecentDecks = () => {
    //get random image
    server.post("/api/features/recent/decks").then(response => {
      let res = response
      // console.log(res) 
      updateState({ recentDecks: res })
      return res
    })
  }

  return (
    <div className="Container Page">
      <div className="SearchContent" style={{ backgroundImage: 'url(' + state.bgImageUrl + ')' }}>
        <div className="blur" />
        <div className="SearchBarObject">
          <SearchBar />
          <button className="FancyButton" onClick={handleAdvancedClick}>Advanced</button>
        </div>
      </div>
      {/* this is all hardcoded, will be dynamic content */}
      <div className="DeckContent">
        {state.recentDecks.length > 0 &&
          <div>

            <header className="HeaderText">Recent Decks</header>
            {state.recentDecks.map((item, i) => <DeckTileObject data={item} key={i} />)}

          </div>
        }
      </div>
    </div>
  );
};

export default Home;