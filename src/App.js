import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './pages/Home';
import Deck from './pages/Deck';
import Card from './pages/Card';
import DeckEditor from './pages/DeckEditor';
import CardCreator from './pages/CardCreator';
import Registration from './pages/Registration';
import Navbar from './components/NavBar/NavBar';
import SearchResults from './pages/SearchResults';

  
function App() {
return (
    <Router>
    <Navbar hasSearchBar={true}/>
    <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path="/search" element={<SearchResults />}>
            <Route path="/search/:query?" element={<SearchResults />} />
        </Route>
        <Route exact path='/deck' element={<Deck />} />
        <Route path='/card' element={<Card />}>
            
            <Route path="/card/:id?" element={<Card />} />
        </Route>
        <Route exact path='/deckeditor' element={<DeckEditor />} />
        <Route exact path='/cardcreator' element={<CardCreator />} />
        <Route exact path='/registration' element={<Registration />} />
    </Routes>
    </Router>
);
}

export default App;
