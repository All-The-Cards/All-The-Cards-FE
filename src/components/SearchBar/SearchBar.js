import { React, useState, useContext } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import * as server from '../../functions/ServerTalk.js';
import CardObject from '../CardObject/CardObject.js';
import SearchGlass from './SearchGlass.png';
import { GlobalContext } from '../../context/GlobalContext';


const SearchBar = (params) => {
    const [state, setState] = useState({
        searchResults: [],
        resultsFound: "",
        serverResponse: "",
        query: "",
        type: params.type,
    })

    const [searchIconShadow, setIconShadow] = useState(false);
    // const {searchQuery, setSearchQuery} = useContext(GlobalContext);
    // const {searchType, setSearchType} = useContext(GlobalContext);
    const gc = useContext(GlobalContext)
    const nav = useNavigate()

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
            ...previous,
            ...objectToUpdate
        }))
    }

    const handleChanges = (event) => {
        // updateState({
        //     searchInput: event.target.value
        // })
        gc.setSearchQuery(event.target.value)
    }

    const submitQuery = () => {
        gc.setSearchType("DEF")
        nav("/search/?adv=false/?query=" + gc.searchQuery)
    }

    const toggleType = () => {
        if (gc.searchType === "ADV") {
            gc.setSearchType("DEF")
        }
        if (gc.searchType === "DEF") {
            gc.setSearchType("ADV")
            gc.setSearchQuery("")
        }
    }
  return (

    <div style={{display:'inline'}}>
        <input
            className="SearchBar"
            maxLength={50}
            style={{display:"inline-block"}}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    submitQuery()
                }
            }}
            placeholder="Search..."
            value={gc.searchQuery}
            onChange={handleChanges}
        />
        {/* <img src={SearchGlass} 
            alt="SearchGlass" 
            className="SearchIcon"
            onClick={submitQuery}
        /> */}
        {/* <button onClick={submitQuery}>Search!</button> */}
        {/* <div>
            {state.resultsFound}
            {state.searchResults.map((item, i) => <CardObject data={item} key={i} />)}
        </div> */}
    </div>
    

)}

export default SearchBar