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
import Login from './pages/Login';
  
function App() {
return (
    <BrowserRouter>
        <GlobalProvider>
            <Navbar />
            <Routes>
                <Route exact path='/' element={<Home hasSearchBar={false}/>} />
                <Route path="/search" element={<SearchResults hasSearchBar={true}/>}>
                    {/* <Route path="/search/:query?" element={<SearchResults hasSearchBar={true}/>} /> */}
                </Route>
                <Route path='/deck' element={<Deck hasSearchBar={true}/>} />
                    <Route path="/deck/:id?" element={<Deck hasSearchBar={true}/>} />
                <Route path='/card' element={<Card hasSearchBar={true}/>}>
                    <Route path="/card/:id?" element={<Card hasSearchBar={true}/>} />
                </Route>
                <Route exact path='/deckeditor' element={<DeckEditor hasSearchBar={false}/>} />
                <Route exact path='/cardcreator' element={<CardCreator hasSearchBar={false}/>} />
                <Route exact path='/registration' element={<Registration hasSearchBar={false}/>} />
                <Route exact path='/login' element={<Login hasSearchBar={false}/>} />
            </Routes>
        </GlobalProvider>
    </BrowserRouter>
);
}

export default App;
