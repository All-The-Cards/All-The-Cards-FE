import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext'

// Pages
import Home from './pages/homepage';
import DeckView from './pages/deckview';
import DeckEditor from './pages/deckeditor';
import NewCard from './pages/newcard';
import Registration from './pages/registration';
import Navbar from './components/NavBar/NavBar';

  
function App() {
    return (

        <BrowserRouter>
            <GlobalProvider>
                <Navbar/>
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/deckview' element={<DeckView />} />
                    <Route exact path='/deckeditor' element={<DeckEditor />} />
                    <Route exact path='/newcard' element={<NewCard />} />
                    <Route exact path='/registration' element={<Registration />} />
                </Routes>
            </GlobalProvider>
        </BrowserRouter>

    );
}

export default App;
