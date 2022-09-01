import { React, useState } from 'react';
import DeckTileObject from '../components/DeckTileObject/DeckTileObject.js';

const Home = (props) => {

  const [state, setState] = useState({
    
  })

  const deckTestData1 = {
    title: "Azusa Deck Test",
    id: "hjskda-25908",
    author: "noah_is_awesome97",
    cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/0/b/0b8aff2c-1f7b-4507-b914-53f8c4706b3d.jpg?1596259277",
  } 
  const deckTestData2 = {
    title: "Marsh Flitter Deck Test",
    id: "jkaslg-35198",
    author: "noah_is_awesome97",
    cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/6/4/64da2ec1-fca9-4488-8ac7-78d645a8bf62.jpg?1604193244"
  }
  const deckTestData3 = {
    title: "Arclight Deck Test",
    id: "gajksw-15912",
    author: "noah_is_awesome97",
    cover_art: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092"
  }

  return (
    <div>
      <header>Welcome to All The Cards</header>
      <div>
        <DeckTileObject data = {deckTestData1}/>
        <DeckTileObject data = {deckTestData2}/>
        <DeckTileObject data = {deckTestData3}/>
      </div>
    </div>
  );
  };

export default Home;