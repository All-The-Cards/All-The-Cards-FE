import { React, useState, useEffect, useContext } from 'react';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './GlobalStyles.css'
import './User.css'
import DeckTileObject from '../components/DeckTileObject/DeckTileObject.js';

import { GlobalContext } from "../context/GlobalContext";

const User = (props) => {

  const gc = useContext(GlobalContext);

    const [state, setState] = useState({
      data: {},
      decks: []
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
      gc.setSearchBar(props.hasSearchBar)
      // console.log(id)
      getUserById(id)
      getDecksByUserId(id)
    }, [id])

    const getUserById = (query) => {
      query = "/api/get/user/" + query
      //if query is empty, don't send
      if (query.trim() === "/api/get/user/" ) {
        return
      }
  
      server.post(query).then(response => {
        console.log("User: ", response[0])
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

    const getDecksByUserId = (query) => {
      query = "/api/get/decks/user_" + query
      //if query is empty, don't send
      if (query.trim() === "/api/get/decks/user_id=" ) {
        return
      }
  
      server.post(query).then(response => {
        console.log("User Decks: ", response)
        //if invalid, just direct to search page
        if (response.length === 0) {
          // nav('/search/')
        }
        else {
          updateState({
            decks: response,
          })
        }  
      })
  
    }

  return (
    <>
      <div className='Container'>
        <div className="UserPageContent" >
          <div className="UserPage-Left">
            <div className="UserInfo">
            <div className="ProfilePicture" style={{backgroundImage: "url(" + state.data.avatar + ")", float:"left"}}></div>
            
              <div className="UserDetails">
                <div className="HeaderText">
                  {state.data.username}
                </div>
                <div className="BodyText">
                  <i>{state.data.location}</i>
                </div>
              </div>
            </div>
          </div>
          <div className="UserPage-Right">
            <div className="HeaderText" style={{fontSize: "28px"}}>
              About Me
            </div>
            <div className="SubHeaderText">
              {state.data.bio}
            </div>
          </div>
        </div>
        <div className="UserPageContent" id="deckContent">
        {state.decks.length > 1 && <div className="HeaderText">
          Decks
        </div>}
        { state.decks.map((item, i) => <DeckTileObject data={item} key={i}/>) }
        </div>
      </div>
    </>
  );

};

export default User;