import { React, useState, useEffect, useContext } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as server from '../functions/ServerTalk.js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './GlobalStyles.css'
import './Card.css'

import { GlobalContext } from "../context/GlobalContext";
import * as mana from '../components/TextToMana/TextToMana.js'
import Sparkles from '../images/sparkles.png'

const Card = (props) => {

    const [state, setState] = useState({
      card: <div></div>,
      isFavorited: false,
      data: {},
      versionOptions: [<option value={"null"}>null</option>],
      hasGottenVersions: false,
      legalitiesDisplayLeft: [<div></div>],
      legalitiesDisplayRight: [<div></div>],
      oracleTextWithSymbols: <div/>,
      oracleTextWithSymbols_face0: <div/>,
      oracleTextWithSymbols_face1: <div/>,
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }

    const nav = useNavigate()
    const gc = useContext(GlobalContext)

    const id = useSearchParams()[0].toString()

    useEffect(() => {
      gc.setSearchBar(props.hasSearchBar)
      //clean up string from id format to search query format
      getCardById(id)

      getFavStatus(id)
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
        generateOracleText(response[0])
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
      let names = ["Standard", "Future Standard", "Historic", "Gladiator", "Pioneer", "Explorer",
      "Modern", "Legacy", "Pauper", "Vintage", "Penny Dreadful", "Commander", "Brawl", "Historic Brawl",
      "Alchemy", "Pauper Commander", "Duel", "Old School", "Pre-Modern"]
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
          a.push(<div style={{marginTop: '8px'}} title={entry} key={i}>
          <div style={{width: '16px', height:'16px', backgroundColor:color, borderRadius:'20px'}}>   
          <div style={{marginLeft: '30px', whiteSpace:'nowrap'}}>{names[i]}</div>
          </div>
        </div>)
        }
        else {
        b.push(<div style={{marginTop: '8px'}}title={entry}key={i}>
        <div style={{width: '16px', height:'16px', backgroundColor:color, borderRadius:'20px'}}>   
        <div style={{marginLeft: '30px', whiteSpace:'nowrap'}}>{names[i]}</div>
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

    const generateOracleText = (card) => {
      if (card.oracle_text) {
        updateState({
          oracleTextWithSymbols: mana.replaceSymbols(card.oracle_text)
        })
      }
      else if (card.card_faces){
        updateState({
          oracleTextWithSymbols_face0: mana.replaceSymbols(card.card_faces[0].oracle_text),
          oracleTextWithSymbols_face1: mana.replaceSymbols(card.card_faces[1].oracle_text)
        })
      }
    }

    const setAsAvatar = () => {
      let imgLink = ""
      if (state.data.image_uris !== null) {
          imgLink = state.data.image_uris.art_crop
      }
      else if (state.data.card_faces) {
          imgLink = state.data.card_faces[0].image_uris.art_crop
      }
      else {
        imgLink = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
      }
      const sendData = {
        avatar: imgLink
      }

      console.log("Setting avatar: ", sendData)
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
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const toggleFavorite = (id) => {
    const sendData = {
      card: state.data.id
    }
    console.log("Sending fav update: ", sendData)

    fetch(server.buildAPIUrl("/api/features/user/favorite"),
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
    })
    .catch((error) => {
      console.log(error);
    });
      updateState({
        isFavorited: !state.isFavorited
      })
    }

    const getFavStatus = (id) => {
      id = id.substring(3)
      // console.log("FAV ID:", id)

      if (gc.activeSession) {
        const uid = gc.activeSession.user.id
        const query = "/api/get/user/" + "id=" + uid
        //if query is empty, don't send
        if (query.trim() === "/api/get/user/" ) {
          return
        }
        server.post(query).then(response => {
          // console.log("User: ", response[0])
          //if invalid, just direct to search page
          if (response.length === 0) {
            nav('/')
          }
          else {
            // console.log(id)
            if (response[0].favorites.cards.includes(id)){
              // console.log("Favorite found")
              updateState({
                isFavorited: true
              })
            }
            else {
              // console.log("No match")
              updateState({
                isFavorited: false
              })
            }
          }  
        })
      }
            
      
    }

  return (
      <div className='Container Page'>
        {
          !state.hasGottenVersions && 
          <div className="HeaderText" style={{textAlign:'center'}}>
          Loading...
          {/* <img src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif"/> */}
        </div>
        }
        { state.hasGottenVersions &&
        <div className="CardPageContent">
          <div className="CardPage-Left">
            <div className="LargeCard">
            {state.card}
            </div>
            <br></br>
            <br></br>
            <div id="priceInfo">
              
            {state.data.name} - {state.data.set_shorthand.toUpperCase()}
            <br></br>
            <br></br>
            {/* <div style={{fontSize:'24px'}}><b>Market Info:</b></div> */}
            {/* {
              (state.data.prices.tix || state.data.prices.usd || state.data.prices.usd_foil) && 
              <div style={{fontSize:'24px'}}><b>Market Info:</b></div>
            } */}
            {
            state.data.prices.usd && 
              <div>{"Price: " + ((state.data.prices.usd && "$" + state.data.prices.usd) || "N/A") } 
              <br></br>
              </div>
            }
            {/* {
              state.data.prices.usd_foil && 
                <div>{"Foil: " + ((state.data.prices.usd_foil && "$" + state.data.prices.usd_foil) || "N/A") }
                <br></br>
                </div>
            } */}
            {/* {
            state.data.prices.eur &&
              <div>{"EUR: " + ((state.data.prices.eur && "???" + state.data.prices.eur) || "N/A") }
              <br></br>
              </div>
            }
            {
              state.data.prices.eur_foil && 
                <div>{"Foil: " + ((state.data.prices.eur_foil && "???" + state.data.prices.eur_foil) || "N/A") }
                <br></br>
                </div>
            } */}
            {
            state.data.tcgplayer_id && 
            <div> 
              <a href={"https://www.tcgplayer.com/product/" + state.data.tcgplayer_id}>
              <i style={{color:"#7138D1"}}>View on TCGPlayer</i>
              </a>
            </div>
            }
            {
              state.data.prices.tix && 
              <div>
              <br></br>
              {("MTGO Price: " + (state.data.prices.tix && state.data.prices.tix + " TIX"))}
              <br></br>
              </div>
            }
            {
              state.data.mtgo_id && 
              <div>
                <a href={"https://www.cardhoarder.com/cards/" + state.data.mtgo_id}>
                <i style={{color:"#7138D1"}}>View on Cardhoarder</i> 
                </a>
                <br></br>
              </div>
            }
            {
              !(state.data.prices.tix || state.data.prices.usd || state.data.prices.usd_foil) && 
              <div><i style={{color:"#7138D1"}}>Pricing info not available</i></div>
            }
            </div>
            
          </div>
          <div className="CardPage-Right">
            <div className="CardPage-RightContent">
              <div className="CardPageContent-TopRow">
                { state.versionOptions.length > 1 && <select className="VersionBubble" onChange={getNewVersion} value={state.data.id}>
                    
                  { state.versionOptions }
                </select> }
                {
                  gc.activeSession &&
                  <button className="FancyButton" style={{float: 'right', marginRight: '20px', marginTop: '10px'}}
                  onClick={() => {
                    setAsAvatar()
                  }}>Set as Avatar</button>
                }

                {
                  gc.activeSession &&
                <div onClick={() => {
                  toggleFavorite()
                  }}
                  style={{float: 'right', marginRight: '20px', marginTop: '10px', cursor:'pointer'}}
                  >
                
                { state.isFavorited &&
                  // <div className="FavoriteIcon" style={{backgroundColor: "Gold"}}>-</div> ||
                  // <div className="FavoriteIcon" style={{backgroundColor: "#dadada"}}>+</div>
                    <img className="FavoriteIcon" title="Remove Favorite" id="isFavorited" src={Sparkles}></img> || 
                    <img className="FavoriteIcon" title="Add Favorite" id="notFavorited" src={Sparkles}></img>
                }
                  </div>
}
                </div>
                
                <div className="HeaderText" id="cardName"> 
                {state.data.name}
                </div>
                <div>
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
              <div className="BodyText" id="cardDetails" style={{whiteSpace:"pre-line"}}> 
              {/* {state.data.oracle_text} */}
              {/* {mana.generateSymbols(state.data.oracle_text)} */}
              {state.oracleTextWithSymbols}
              {state.data.card_faces && 
              <>
                <div style={{fontWeight: 'bold'}}>{state.data.card_faces[0].name}:</div>
                {state.oracleTextWithSymbols_face0}
              </>
              } {"\n\n"}
                {state.data.card_faces && 
              <>
                <div style={{fontWeight: 'bold'}}>{state.data.card_faces[1].name}:</div>
                {state.oracleTextWithSymbols_face1}
              </>
              }
              </div>
              <div className="BodyText" id="legalities"> 
                <b>Legality:</b> {"\n"}
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
        } 
      </div>
  );

};

export default Card;