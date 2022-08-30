import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './pages/Home';
import DeckView from './pages/Deck';
import DeckEditor from './pages/DeckEditor';
import NewCard from './pages/CardCreator';
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
        <Route exact path='/deckview' element={<DeckView />} />
        <Route exact path='/deckeditor' element={<DeckEditor />} />
        <Route exact path='/newcard' element={<NewCard />} />
        <Route exact path='/registration' element={<Registration />} />
    </Routes>
    </Router>
);
}

export default App;
