import { React, useState, useEffect, useContext } from "react";
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from "../../context/GlobalContext";
import logo from './logo.png'
import SearchBar from "../SearchBar/SearchBar";
  
const Navbar = () => {

    const nav = useNavigate()

    // Global Context Variables
    const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

    // MUI Menu & MenuItem variables
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [iconType, setIconType] = useState("");

    // Opens the MUI Menu when the Icons are clicked
    const handleIconClick = (event) => {

        setAnchorEl(event.currentTarget)
        setIconType(event.currentTarget.id)

    };

    // This will bring the user back to the homepage or (Needs to be added!) refreshes the page when user is already on the homepage
    const handeLogoClick = () => {

        nav('/')

    };

    // Each MenuItem must have an ID so the handler knows which page to navigate to
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

    // Used for debugging
    // useEffect(()=>{

    //     console.log(hasSearchBar)
        
    // },[hasSearchBar])


  return(

    <div className="NavBarContainer">
        <div className="LogoContainer">
            <img src={logo} alt="logo" className="Logo" onClick={handeLogoClick}></img>
        </div>

        <div className="SearchContainer">
            { 
                hasSearchBar &&
                <SearchBar type="global"/>
            }
        </div>
    
        <div className="IconContainer">
            {/* <IconButton 
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
            </Menu> */}
            
        </div>
    </div>

  );
};
  
export default Navbar;