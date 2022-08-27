import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './pages/homepage';
import DeckView from './pages/deckview';
import DeckEditor from './pages/deckeditor';
import NewCard from './pages/newcard';
import Registration from './pages/registration';
import Navbar from './components/NavBar/NavBar';

  
function App() {
return (
    <Router>
    <Navbar hasSearchBar={true}/>
    <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/deckview' element={<DeckView />} />
        <Route exact path='/deckeditor' element={<DeckEditor />} />
        <Route exact path='/newcard' element={<NewCard />} />
        <Route exact path='/registration' element={<Registration />} />
    </Routes>
    </Router>
);
}

export default App;
