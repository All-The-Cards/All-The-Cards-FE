import { React, useState, useEffect, useContext, useRef} from "react";
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from "../../context/GlobalContext";
import Logo from './logo.png'
import Logo_Star from './logo_star.png'
import Logo_Name from './logo_text_marginleft.png'
import SearchBar from "../SearchBar/SearchBar";
import LayerIcon from './layers_icon.png'
import UsersIcon from './users_icon.png'
import * as server from '../../functions/ServerTalk.js'

  
const Navbar = () => {
    
    const nav = useNavigate()
    const wrapperRef = useRef(null)

    // Global Context Variables
    const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

    // Variables strickly on the NavBar
    const [layerShadow, setLayerShadow] = useState(false);
    const [userShadow, setUserShadow] = useState(false);
    const [openLayerMenu, setLayerMenu] = useState(false);
    const [openUserMenu, setUserMenu] = useState(false);

    // This will bring the user back to the homepage or (Needs to be added!) refreshes the page when user is already on the homepage
    const handeLogoClick = () => {

        if(window.location.pathname !== "/")
        {
            nav('/')
        }
        else
        {
           window.location.reload(false);
        }

    };

    // Opens the menu when an icon is clicked
    const onClickHandler = () => {

        if(layerShadow)
            setLayerMenu(true)
        else if(userShadow)
            setUserMenu(true)

    };

    // Handles clicking outside of the menu
    const handleClickOutside = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            
            setLayerMenu(false)
            setUserMenu(false)
        }
    };

    // Each MenuItem must have an ID so the handler knows which page to navigate to
    const handleClose = (event) => {

        let id = event.currentTarget.id

        if(id === '1')
        {
            setLayerMenu(false)
            setUserMenu(false)            
            nav('/deck')
        }
        else if (id === '2')
        {
            setLayerMenu(false)
            setUserMenu(false)   
            nav('/deckeditor')
        }
        else if (id === '3')
        {
            setLayerMenu(false)
            setUserMenu(false)  
            nav('/cardcreator')
        }
        else if (id === '4')
        {
            setLayerMenu(false)
            setUserMenu(false)  
            nav('/login')
        }
        else if (id === '5')
        {
            setLayerMenu(false)
            setUserMenu(false) 
            nav('/registration')
        }
        else
            console.log("Dark Mode Activated")

    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true)
        return () => {
            document.addEventListener("click", handleClickOutside, true)
        }
      }, [wrapperRef]);

    // Used for debugging
    // useEffect(()=>{

    //     console.log(showShadow)
        
    // },[showShadow])


  return(

    <div className="NavBarContainer">
        <a className="LogoContainer" href={server.buildRedirectUrl()} >
            <img 
                src={Logo_Star} 
                alt="logo" 
                className="Logo"
            /><img 
            src={Logo_Name} 
            alt="logo" 
            className="Logo"
            id="Logo-responsive"
            />
        </a>

        <div className="IconContainer">
            { hasSearchBar &&
                <SearchBar type="global"/>
            }
            <img src={LayerIcon} alt="LayerIcon" className={`Icons ${layerShadow ? "LayerIcon" : ''}`} onMouseEnter={() => setLayerShadow(true)} onMouseLeave={() => setLayerShadow(false)} onClick={onClickHandler}></img> 
            {openLayerMenu &&
                <div id={'1'} className="LayerMenu" ref={wrapperRef}>
                    <div id={'1'} className="MenuItems" onClick={handleClose}>Deck Library</div>
                    <div id={'2'} className="MenuItems" onClick={handleClose}>New Deck</div>
                    <div id={'3'} className="MenuItems" onClick={handleClose}>New Card</div>
                </div>
            }
            <img src={UsersIcon} alt="UsersIcon" className={`Icons ${userShadow ? "UserIcon" : ''}`} onMouseEnter={() => setUserShadow(true)} onMouseLeave={() => setUserShadow(false)} onClick={onClickHandler}></img>
            {openUserMenu &&
                <div>
                    <div id={'2'} className="UserMenu" ref={wrapperRef}>
                        <div id={'4'} className="MenuItems" onClick={handleClose}>Login</div>
                        <div id={'5'} className="MenuItems" onClick={handleClose}>Register</div>
                        <div id={'6'} className="MenuItems" onClick={handleClose}>Dark Mode</div>
                    </div>
                </div>
            }
        </div>

    </div>

  );
};
  
export default Navbar;