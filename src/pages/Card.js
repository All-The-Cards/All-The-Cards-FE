import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './GlobalStyles.css'
import './Card.css'

import { GlobalContext } from "../context/GlobalContext";

const Card = (props) => {

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

    const [state, setState] = useState({
      card: <div></div>,
      data: {},
      versionOptions: [<option value={"null"}>null</option>],
      hasGottenVersions: false,
      legalitiesDisplayLeft: [<div></div>],
      legalitiesDisplayRight: [<div></div>]
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
          if (!state.hasGottenVersions) getAllVersions(response[0].name)
        }
        buildLegalities(response[0].legalities)
  
      })
  
    }

    const getAllVersions = (name) => {
      // name = name.replaceAll(',', '')

      let nameSplit = name.split('/')[0]
      server.post("/api/search/card/query=" + nameSplit).then(response => {
        let res = response
        // console.log("All matches: ", res)
        let sameName = res.filter((item) => {
          return item.name === name
        })
        res = sameName
        // console.log("Same name only", res)
        //sort results alphabetically
        res = res.sort(sortBySetName)
        
        let arr = []
        for (let [key, entry] of Object.entries(res) ) {
          // console.log(entry)
          // console.log(key, entry.set_shorthand, entry.set_name, entry.name)
          arr.push(<option value={entry.id} key={key}>{entry.set_name + " | " + entry.set_shorthand.toUpperCase()}</option>)
        }

        updateState({
          versionOptions: arr,
          hasGottenVersions: true
        })
      })

      
      const sortBySetName = (a, b) => {
        if (a.set_name >= b.set_name) {
          return 1
        }
        else {
          return -1
        }
      }

    }
    const getNewVersion = (e) => {
      nav('/card/?id=' + e.target.value)
      // getCardById("id=" + e.target.value)
    }

    const buildLegalities = (legalities) => {
      let a = []
      let b = []
      let i = 0
      for (let [key, entry] of Object.entries(legalities) ) {
        // console.log(key, entry)
        let color = ""
        switch (entry){
          case "legal":
            color="rgb(20,200,90)"
            break;
          case "not_legal":
            color="#bbbbbb"
            break;
          case "banned":
            color="rgb(230,20,20)"
            break;
          case "restricted":
            color="rgb(230,180,70)"
            break;
        }
        if (i >= Object.keys(legalities).length / 2){
          a.push(<div style={{marginTop: '8px'}} title={entry}>
          <div style={{width: '16px', height:'16px', backgroundColor:color, borderRadius:'20px'}}>   
          <div style={{marginLeft: '30px'}}>{key}</div>
          </div>
        </div>)
        }
        else {
        b.push(<div style={{marginTop: '8px'}}title={entry}>
        <div style={{width: '16px', height:'16px', backgroundColor:color, borderRadius:'20px'}}>   
        <div style={{marginLeft: '30px'}}>{key}</div>
        </div>
      </div>)
        }
        i++
      }
      updateState({
        legalitiesDisplayLeft: b,
        legalitiesDisplayRight: a
      })
    }

  return (
    <>
      <div className='Container'>
        <div className="CardPageContent">
          <div className="CardPage-Left">
            <div className="LargeCard">
            {state.card}
            </div>
          </div>
          <div className="CardPage-Right">
            <div className="CardPage-RightContent">
              <div className="CardPageContent-TopRow">
                { state.versionOptions.length > 1 && <select className="VersionBubble" onChange={getNewVersion} value={state.data.id}>
                    
                  { state.versionOptions }
                </select> }
                <div className="HeaderText" id="cardName"> 
                {state.data.name}
                </div>
              </div>
              <div className="SubHeaderText" id="typeLine"> 
              {state.data.type_one} {(state.data.subtype_one !== null) && " - "}{state.data.subtype_one}
              {state.data.type_two && " // "}
              {state.data.type_two} {(state.data.subtype_two !== null) && " - "}{state.data.subtype_two}
              </div>
              <div className="SubHeaderText" id="statsLine"> 
              { state.data.power &&
                state.data.power + "/" + state.data.toughness
              }
              </div>
              <div className="SubHeaderText" id="statsLine"> 
              { state.data.loyalty &&
                "Loyalty: " + state.data.loyalty
              }
              </div>
              <div className="BodyText" id="cardDetails"> 
              {state.data.oracle_text}
              {state.data.card_faces && 
              <>
                <div style={{fontWeight: 'bold'}}>{state.data.card_faces[0].name}:</div>
                <div>{state.data.card_faces[0].oracle_text}</div>
              </>
              } {"\n\n"}
                {state.data.card_faces && 
              <>
                <div style={{fontWeight: 'bold'}}>{state.data.card_faces[1].name}:</div>
                <div>{state.data.card_faces[1].oracle_text}</div>
              </>
              }
              </div>
              <div className="BodyText" id="legalities"> 
              Legality: {"\n"}
              <div className='legalities-Left'>
              {state.legalitiesDisplayLeft}
              </div>
              <div className='legalities-Right'>
              {state.legalitiesDisplayRight}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default Card;