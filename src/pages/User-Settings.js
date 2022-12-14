import { React, useState, useEffect, useContext } from 'react';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './GlobalStyles.css'
import './User-Settings.css'

import { GlobalContext } from "../context/GlobalContext";


const UserSettings = (props) => {

  const gc = useContext(GlobalContext);
  const { darkMode } = useContext(GlobalContext)

  const [state, setState] = useState({
    data: {

    },
    inputs: {
      email: "",
      //password: "",
      typePassword: "",
      confirmPassword: "",
      username: "",
      bio: "",
      name: "",
      location: "",
      avatar: ""
    },
    decks: []
  })

  const updateState = (objectToUpdate) => {
    setState((previous) => ({
      ...previous,
      ...objectToUpdate
    }))
  }

  const nav = useNavigate()
  // const id = useSearchParams()[0].toString()

  useEffect(() => {
    gc.setSearchBar(props.hasSearchBar)
    document.title = "Settings"

    let id = "id="
    if (gc.activeSession) {
      id += gc.activeSession.user.id
      // id += "6a0cd1d6-1278-45d0-aa0e-419ae50add06"
    }
    else {
      nav('/')
    }

    // console.log(id)
    getUserById(id)
  }, [])

  const getUserById = (query) => {
    // console.log(query)
    query = "/api/get/user/" + query
    //if query is empty, don't send
    if (query.trim() === "/api/get/user/") {
      return
    }

    server.post(query).then(response => {
      console.log("User: ", response[0])
      //if invalid, just direct to search page
      if (response.length === 0) {
        nav('/')
      }
      else {
        document.title = response[0].username
        updateState({
          data: response[0],
        })
        // console.log(response[0])
        populateUserData(response[0])
      }
    })


  }

  //fill field defaults
  const populateUserData = (data) => {
    updateState({
      inputs: {
        ...state.inputs,
        email: gc.activeSession.user.email,
        username: data.username || "",
        bio: data.bio || "",
        name: data.name || "",
        location: data.location || "",
        avatar: data.avatar || ""
      }
    })
  }


  const submitUserSettings = async () => {
    // console.log("state.inputs:", state.inputs)
    let sendData = {
      email: "",
      username: "",
      bio: "",
      name: "",
      location: "",
      // avatar: ""
    }
    //if password update matches, send password change
    if (state.inputs.typePassword === state.inputs.confirmPassword && state.inputs.typePassword !== "") {
      updateState({
        inputs: {
          ...state.inputs,
          password: state.inputs.typePassword
        }
      })
      sendData.password = state.inputs.typePassword
    }
    else if (state.inputs.typePassword !== "") {
      console.log("Password did not match")
    }
    sendData.email = state.inputs.email
    sendData.username = state.inputs.username
    sendData.bio = state.inputs.bio
    sendData.name = state.inputs.name
    sendData.location = state.inputs.location
    // sendData.avatar = state.inputs.avatar

    console.log("Sending: ", sendData)

    fetch(server.buildAPIUrl("/api/features/user/update"),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': gc.activeSession.access_token
        },
        //send inputs
        body: JSON.stringify(sendData),

      }
    )
      .then((response) => {
        console.log(response);
      })

      .then((data) => {
        console.log(data);
        updateName()
      })
      .catch((error) => {
        console.log(error);
      });


    // Michaels Code -- putting new name into localStorage
    async function updateName() {
      let updatedUser = await gc.supabase.auth.getUser()
      localStorage.setItem("userName", updatedUser.data.user.user_metadata.name.split(" ")[0]);
      let currentSession = await gc.supabase.auth.getSession()
      currentSession.data.session.user = updatedUser.data.user
      localStorage.setItem("sb-pkzscplmxataclyrehsr-auth-token", JSON.stringify(currentSession.data.session))
      gc.setActiveSession(JSON.parse(localStorage.getItem("sb-pkzscplmxataclyrehsr-auth-token")))
      gc.getName()
    }

  }
  return (
    <>
      <div className={`Container Page ${darkMode ? "ContainerDark Page" : ''}`}>
        <div className={`UserPageContent ${darkMode ? "UserPageContentDark" : ''}`} >
          <div className="UserPage-Left">
            <div className="UserInfo">
              <div className="ProfilePicture" style={{ backgroundImage: "url(" + state.data.avatar + ")", float: "left" }}></div>

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
          <div className="UserSettingsPage-Right">
            <div className="HeaderText" style={{ fontSize: "28px", marginBottom: '20px' }}>
              Settings
            </div>
            <form onSubmit={(event) => {
              console.log("form submit")
              event.preventDefault()
              submitUserSettings()
            }}>
              <div className="AdvRow" id="userSettings">
                <div className="AdvOption" id="userSettingsText">
                  Email:
                </div>
                <input
                  className='settingInput'
                  value={state.inputs.email}
                  onChange={(e) => { updateState({ inputs: { ...state.inputs, email: e.target.value } }) }}
                />
              </div>
              <div className="AdvRow" id="userSettings">
                <div className="AdvOption" id="userSettingsText">
                  Change Password:
                </div>
                <input
                  className='settingInput'
                  value={state.inputs.typePassword}
                  onChange={(e) => { updateState({ inputs: { ...state.inputs, typePassword: e.target.value } }) }}
                />
              </div>
              <div className="AdvRow" id="userSettings">
                <div className="AdvOption" id="userSettingsText">
                  Confirm Password:
                </div>
                <input
                  className='settingInput'
                  value={state.inputs.confirmPassword}
                  onChange={(e) => { updateState({ inputs: { ...state.inputs, confirmPassword: e.target.value } }) }}
                />
              </div>
              <div className="AdvRow" id="userSettings">
                <div className="AdvOption" id="userSettingsText">
                  Username:
                </div>
                <input
                  className='settingInput'
                  value={state.inputs.username}
                  onChange={(e) => { updateState({ inputs: { ...state.inputs, username: e.target.value } }) }}
                />
              </div>
              <div className="AdvRow" id="userSettings">
                <div className="AdvOption" id="userSettingsText">
                  Bio:
                </div>
                <input
                  className='settingInput'
                  value={state.inputs.bio}
                  onChange={(e) => { updateState({ inputs: { ...state.inputs, bio: e.target.value } }) }}
                />
              </div>
              <div className="AdvRow" id="userSettings">
                <div className="AdvOption" id="userSettingsText">
                  Name:
                </div>
                <input
                  className='settingInput'
                  value={state.inputs.name}
                  onChange={(e) => { updateState({ inputs: { ...state.inputs, name: e.target.value } }) }}
                />
              </div>
              <div className="AdvRow" id="userSettings">
                <div className="AdvOption" id="userSettingsText">
                  Location:
                </div>
                <input
                  className='settingInput'
                  value={state.inputs.location}
                  onChange={(e) => { updateState({ inputs: { ...state.inputs, location: e.target.value } }) }}
                />
              </div>
              {/* <div className="AdvOption">
                    Avatar: 
                    <input
                      value={state.inputs.avatar}
                      onChange={(e) => {updateState({inputs: {...state.inputs, avatar: e.target.value}})}}
                    />
                </div> */}
              <button className='FancyButton'>Save</button>
            </form>
          </div>
        </div>
        {/* <div className="UserPageContent" id="deckContent">
          <div className="HeaderText">
            Extra Section
          </div>
            Extra Section Content
        </div> */}
      </div>
    </>
  );

};

export default UserSettings;