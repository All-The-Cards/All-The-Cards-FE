// This Component displays a User List View from User .JSON info

import { React, useEffect, useState } from "react";
import './UserObject.css'
import '../../pages/GlobalStyles.css'
import { Link } from "react-router-dom";

const UserObject = (props) => {

    const [state, setState] = useState({
        data: {
            username: ""
        },
        avatar: ""
    })

    const updateState = (objectToUpdate) => {
        setState((previous) => ({
          ...previous,
          ...objectToUpdate
        }))
    }
    useEffect(() => {
        getData()
        // if (props.data.avatar === null) updateState({ 
        //     avatar: "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092"
        // })
    }, [props])


    const getData = () =>{
        updateState({ 
            data: props.data,
            avatar: props.data.avatar
        })
    }

    return(
        <>
            <Link to={"/user/?id=" + state.data.id}>
                <div className="userTile" style={{backgroundImage: "radial-gradient( rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.3) ), url("+ state.avatar + ")"}}>
                    <div className="HeaderText" id="userHeader">
                    {state.data.username.length <= 14 && state.data.username.slice(0,12)} 
                    {state.data.username.length > 14 && state.data.username.slice(0,12)} 
                    {state.data.username.length > 12 && "..."}
                    </div>
                </div>
            </Link>
        </>
    )
}

export default UserObject