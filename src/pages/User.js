import { React, useState, useEffect, useContext } from 'react';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './GlobalStyles.css'

import { GlobalContext } from "../context/GlobalContext";

const User = (props) => {

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

    const [state, setState] = useState({
      data: {},
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
      console.log(id)
      getUserById(id)
    }, [id])

    const getUserById = (query) => {
      query = "/api/get/user/" + query
      //if query is empty, don't send
      if (query.trim() === "/api/get/user/" ) {
        return
      }
  
      server.post(query).then(response => {
        console.log(response[0])
        //if invalid, just direct to search page
        if (response.length === 0) {
          nav('/search/')
        }
        else {
          document.title = response[0].username
          updateState({
            data: response[0],
          })
        }  
      })
  
    }



  return (
    <>
      <div className='Container'>
        {state.data.username}
      </div>
    </>
  );

};

export default User;