import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { GlobalContext } from "../context/GlobalContext";

const Card = (props) => {

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

    const [state, setState] = useState({
      card: <div></div>,
      data: {}
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }

    const nav = useNavigate()
    const id = useSearchParams()[0].toString()

    useEffect(() => {
      setSearchBar(props.hasSearchBar)
      //clean up string from id format to search query format
        getCardById(id)
    }, [id])

    const getCardById = (query) => {
      query = "/api/get/card/" + query
      //if query is empty, don't send
      if (query.trim() === "/api/get/card/" ) {
        return
      }
      //clear results
      updateState({ card: <div></div> })
  
      server.post(query).then(response => {
        console.log(response[0])
        //if invalid, just direct to search page
        if (response.length === 0) {
          nav('/search/')
        }
        else {
          document.title = response[0].name + " | " + response[0].set_shorthand.toUpperCase()
          updateState({
            data: response[0],
            card: <CardObject data={response[0]}/>
          })
        }
  
      })
  
    }

  return (
    <div>
      <div>
        {state.data.name}, {state.data.set_name}
        {state.card}
      </div>
    </div>
  );

};

export default Card;