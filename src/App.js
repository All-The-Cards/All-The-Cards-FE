import { React, useContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';

// Pages
import Home from './pages/Home';
import Deck from './pages/Deck';
import Card from './pages/Card';
import User from './pages/User';
import UserSettings from './pages/User-Settings';
import DeckEditor from './pages/Deck-Editor';
import CardCreator from './pages/CardCreator';
import Registration from './pages/User-Registration';
import Navbar from './components/NavBar/NavBar';
import WIPDeckList from './components/WIPDeckList/WIPDeckList';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword'
import Footer from './components/Footer/Footer';

function App() {
    return (
        <BrowserRouter>
            <GlobalProvider>
                <Navbar />
                <WIPDeckList/>
                <Routes>
                    <Route exact path='/' element={<Home hasSearchBar={false} />} />
                    <Route path="/search" element={<SearchResults hasSearchBar={true} />}>
                        <Route path="/search/:adv?:query?" element={<SearchResults hasSearchBar={true} />} />
                    </Route>
                    <Route path='/deck' element={<Deck hasSearchBar={true} />} />
                    <Route path="/deck/:id?" element={<Deck hasSearchBar={true} />} />
                    <Route path='/card' element={<Card hasSearchBar={true} />} />
                    <Route path="/card/:id?" element={<Card hasSearchBar={true} />} />
                    <Route path='/user' element={<User hasSearchBar={true} />} />
                    <Route path="/user/:id?" element={<User hasSearchBar={true} />} />
                    <Route exact path='/deckeditor' element={<DeckEditor hasSearchBar={true} />} />
                    <Route exact path='/cardcreator' element={<CardCreator hasSearchBar={false} />} />
                    <Route exact path='/registration' element={<Registration hasSearchBar={false} />} />
                    <Route exact path='/login' element={<Login hasSearchBar={false} />} />
                    <Route exact path='/settings' element={<UserSettings hasSearchBar={true} />} />
                    <Route exact path='/reset-password' element={<ResetPassword hasSearchBar={false} />} />
                </Routes>
                <Footer/>
            </GlobalProvider>
        </BrowserRouter>
    );
}

export default App;
