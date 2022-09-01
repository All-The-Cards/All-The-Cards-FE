import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';

// Pages
import Home from './pages/Home';
import Deck from './pages/Deck';
import Card from './pages/Card';
import DeckEditor from './pages/Deck-Editor';
import CardCreator from './pages/CardCreator';
import Registration from './pages/User-Registration';
import Navbar from './components/NavBar/NavBar';
import SearchResults from './pages/SearchResults';
  
function App() {
return (
    <BrowserRouter>
        <GlobalProvider>
            <Navbar hasSearchBar={true}/>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path="/search" element={<SearchResults />}>
                    <Route path="/search/:query?" element={<SearchResults />} />
                </Route>
                <Route path='/deck' element={<Deck />} />
                    <Route path="/deck/:id?" element={<Deck />} />
                <Route path='/card' element={<Card />}>
                    <Route path="/card/:id?" element={<Card />} />
                </Route>
                <Route exact path='/deckeditor' element={<DeckEditor />} />
                <Route exact path='/cardcreator' element={<CardCreator />} />
                <Route exact path='/registration' element={<Registration />} />
            </Routes>
        </GlobalProvider>
    </BrowserRouter>
);
}

export default App;
