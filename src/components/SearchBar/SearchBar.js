import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import { OutlinedInput } from "@mui/material";
import { BorderAllRounded } from '@mui/icons-material';

import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as server from '../../functions/ServerTalk.js';
import CardObject from '../CardObject/CardObject.js'

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
        if (state.type === 'global') {
            if (state.searchInput.trim() !== "") {
                nav("/search/?query=" + state.searchInput)
             }
        }
        if (state.type === 'local'){
            //send a query to the server for matching cards
            if (state.searchInput.trim() !== "") {
                search("query=" + state.searchInput.trim())
            }
        }
    }

    const search = (query) => {
        query = "/api/search/" + query
        //if query is empty, don't send
        if (query.trim() === "/api/search/" ) {
          return
        }
        //clear results
        updateState({ searchResults: [] })
    
        server.post(query).then(response => {
          if (response.length === 0) {
            updateState({ resultsFound: <div>No Results Found</div> })
          }
          else {
            updateState({
              resultsFound: <div>{response.length} Results Found</div>,
              searchResults: response
            })
          }
    
        })
    
      }
  return (

    <div className="SearchBar">
        <OutlinedInput
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    submitQuery()
                }
            }}
            id="outlined-adornment"
            type="search"
            placeholder="Search..."
            value={state.searchInput}
            onChange={handleChanges}
            size="small"
            fullWidth={true}
            sx={{
                bgcolor: "white",
                borderRadius: 25,
                height: 35,
                sm:{
                    
                }
            }}
            endAdornment={
                <InputAdornment 
                position="end"
                onClick={submitQuery}>
                    <IconButton aria-label="search" size="small">
                        <SearchIcon fontSize="small"/>
                    </IconButton>
                </InputAdornment>
            }
        />
        <div>
            {state.resultsFound}
        {state.searchResults.map((item, i) => <CardObject data={item} key={i} />)}
        </div>
    </div>
    

)}

export default SearchBar