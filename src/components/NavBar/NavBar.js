import { React, useState, useEffect, useContext } from "react";
import './NavBar.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import logo from './logo.png'
import SearchBar from "../SearchBar/SearchBar";
import LayersIcon from '@mui/icons-material/Layers';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GlobalContext } from "../../context/GlobalContext";
  
const Navbar = () => {

    const nav = useNavigate()
    const { hasSearchBar, setSearchBar } = useContext(GlobalContext)   
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [iconType, setIconType] = useState("");

    const handleIconClick = (event) => {

        setAnchorEl(event.currentTarget)
        setIconType(event.currentTarget.id)

    };

    const handeLogoClick = () => {

        nav('/')
    };

    const handleClose = (event) => {

        let id = event.currentTarget.id

        if(id === '1')
            nav('/deckview')
        else if (id === '2')
            nav('/deckeditor')
        else if (id === '3')
            nav('/newcard')
        else if (id === '4')
            setAnchorEl(null)
        else if (id === '5')
            nav('/registration')
        else
            setAnchorEl(null)
    };

    // useEffect(()=>{

    //     console.log(hasSearchBar)
        
    // },[hasSearchBar])


  return(

    <div className="NavBarContainer">
        <div className="LogoContainer">
            <img src={logo} alt="logo" className="Logo" onClick={handeLogoClick}></img>
        </div>

        {/* <div className="SearchContainer">
            {hasSearchBar &&
                <SearchBar/>
            }
        </div> */}
    
        <div className="IconContainer">
            <IconButton 
                id="basic-layerbutton"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleIconClick}
                sx={{
                    color: "black"
                }}
            >
                <LayersIcon fontSize="medium" />
            </IconButton>

            <IconButton
                id="basic-profilebutton"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleIconClick}
                sx={{
                    color: "black"
                }}
            >
                <PersonIcon fontSize="medium" />
            </IconButton>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-layerbutton',
                }}
            >
                {iconType === "basic-layerbutton" &&
                    <div>
                        <MenuItem id={'1'} onClick={handleClose}>View Library</MenuItem>
                        <MenuItem id={'2'} onClick={handleClose}>New Deck</MenuItem>
                        <MenuItem id={'3'} onClick={handleClose}>New Card</MenuItem>
                    </div>
                }

                {iconType === "basic-profilebutton" &&
                    <div>
                        <MenuItem id={'4'} onClick={handleClose}>Login</MenuItem>
                        <MenuItem id={'5'} onClick={handleClose}>Create Account</MenuItem>
                        <MenuItem id={'6'} onClick={handleClose}>Dark Mode</MenuItem>
                    </div>
                }
            </Menu>
            
        </div>
    </div>

  );
};
  
export default Navbar;