import { React, useState, useEffect } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Card = (props) => {

    const [state, setState] = useState({
      card: <div></div>
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
      //clean up string from id format to search query format
        let cardName = id.replaceAll('+', ' ')
        cardName = cardName.replace('id=', '')
        console.log(cardName)
        let cardNameToQuery = "query=" + cardName
        getCardByExactName(cardNameToQuery)
    }, [id])

    const getCardByExactName = (query) => {
      query = "/api/search/" + query
      //if query is empty, don't send
      if (query.trim() === "/api/search/" ) {
        return
      }
      //clear results
      updateState({ card: <div></div> })
  
      server.post(query).then(response => {
        console.log(response)
        //if invalid, just direct to search page
        if (response.length === 0) {
          nav('/search/')
        }
        else {
          updateState({
            card: <CardObject data={response[0]}/>
          })
        }
  
      })
  
    }

  return (
    <div>
      <div>{state.card}</div>
    </div>
  );

};

export default Card;