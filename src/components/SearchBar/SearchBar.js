import { React, useState } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import * as server from '../../functions/ServerTalk.js';
import CardObject from '../CardObject/CardObject.js';
import SearchGlass from './SearchGlass.png';


// Parameters:
//      type
//      expected: string - 'local' or 'global'
//          'global' redirects to site-wide search
//          'local' gets search results locally, for deckbuilder use
//                  
//

const SearchBar = (params) => {
    const [state, setState] = useState({
        searchResults: [],
        resultsFound: "",
        serverResponse: "",
        searchInput: "",
        query: "",
        type: params.type,
    })

    const [searchIconShadow, setIconShadow] = useState(false);
    const nav = useNavigate()

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
            ...previous,
            ...objectToUpdate
        }))
    }

    const handleChanges = (event) => {
        updateState({
            searchInput: event.target.value
        })
    }

    const submitQuery = () => {
        if (state.searchInput.trim() !== "") {
            nav("/search/?query=" + state.searchInput)
            }
    }
  return (

    <div className='SearchContainer'>
        <input
            className="SearchBar"
            maxLength={50}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    submitQuery()
                }
            }}
            placeholder="Search..."
            value={state.searchInput}
            onChange={handleChanges}
        />
        <img src={SearchGlass} 
            alt="SearchGlass" 
            className={`SearchIcon ${searchIconShadow ? "SearchIconShadow" : ''}`} 
            onMouseEnter={() => setIconShadow(true)} 
            onMouseLeave={() => setIconShadow(false)}
            onClick={submitQuery}
        />
        {/* <button onClick={submitQuery}>Search!</button> */}
        <div>
            {state.resultsFound}
        {state.searchResults.map((item, i) => <CardObject data={item} key={i} />)}
        </div>
    </div>
    

)}

export default SearchBar