import { React, useState, useEffect } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import CardListObject from '../components/CardListObject/CardListObject.js';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Deck = (props) => {

    const [state, setState] = useState({
      data: []
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
        getDeckById(id)
    }, [id])

    const getDeckById = (query) => {
      query = "/api/get/deck/" + query
      //if query is empty, don't send
      if (query.trim() === "/api/get/deck/" ) {
        return
      }
  
      server.post(query).then(response => {
        console.log(response)
        //if invalid, just direct to search page
        if (response.length === 0) {
          nav('/search/')
        }
        else {
          updateState({
            data: response
          })
          console.log(response)
        }
  
      })
  
    }

  return (
    <div>
      <div>
        {state.data.name}
        {state.data.map((item, i) => 
          <div style={{margin: '10px', display:'inline-block'}}key={i}><CardListObject data={item}/> <CardObject data={item}/></div>
        )}
      </div>
    </div>
  );

};

export default Deck;