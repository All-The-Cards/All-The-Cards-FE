import { React, useState, useEffect, useContext, useRef } from "react";
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from "../../context/GlobalContext";
import Logo_Star from './logo_star.png'
import Logo_Name from './logo_text_marginleft.png'
import Logo_Name_Dark from './logo_text_white.png'
import SearchBar from "../SearchBar/SearchBar";
import LayerIcon from './layers_icon.png'
import LayerIconWhite from './layers_icon_white.png'
import UsersIcon from './users_icon.png'
import UsersIconWhite from './users_icon_white.png'
import * as server from '../../functions/ServerTalk.js'
import SearchGlass from './SearchGlass.png';
import { Link } from "react-router-dom";
import { saveToLocalStorage } from "../../functions/Utilities";


const Navbar = () => {

    const nav = useNavigate()
    const wrapperRef = useRef(null)

    // Global Context Variables
    const gc = useContext(GlobalContext);
    const { activeSession, setActiveSession } = useContext(GlobalContext);
    const { darkMode, setDarkMode } = useContext(GlobalContext);
    const { name, setName } = useContext(GlobalContext);

    // Variables strickly on the NavBar
    const [layerShadow, setLayerShadow] = useState(false);
    const [userShadow, setUserShadow] = useState(false);
    const [openLayerMenu, setLayerMenu] = useState(false);
    const [openUserMenu, setUserMenu] = useState(false);
    const [loggedInUserMenu, setLoggedUserMenu] = useState(false);

    useEffect(() => {
        console.log(gc)
        if (activeSession) {
            //let data = localStorage.getItem("sb-pkzscplmxataclyrehsr-auth-token")
            //setActiveSession(JSON.parse(data))
            if (localStorage.getItem("userName") === "User")
                setName("User")
            else {
                let firstName = localStorage.getItem("userName")
                setName(firstName)
            }
        }
        else {
            gc.getName()
        }

    }, []);

    useEffect(() => {
        console.log(activeSession)
        gc.getName()
    }, [activeSession]);

    // Opens the menu when an icon is clicked
    const onClickHandler = () => {

        if (layerShadow)
            setLayerMenu(true)
        else if (userShadow) {
            if (activeSession !== null) {
                setLoggedUserMenu(true)
            }
            else {
                setUserMenu(true)
            }
        }

    };

    // Handles clicking outside of the menu
    const handleClickOutside = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {

            setLayerMenu(false)
            setUserMenu(false)
            setLoggedUserMenu(false)
        }
    };

    // Each MenuItem must have an ID so the handler knows which page to navigate to
    const handleClose = (event) => {

        let id = event.currentTarget.id

        if (id === '0') {
            setLayerMenu(false)
            setLoggedUserMenu(false)
            nav(`/user/?id=${activeSession.user.id}`)
        }
        else if (id === '1') {
            setLayerMenu(false)
            setUserMenu(false)
            nav('/deck')
        }
        else if (id === '2') {
            setLayerMenu(false)
            setUserMenu(false)
            nav('/deckeditor')
        }
        else if (id === '3') {
            setLayerMenu(false)
            setUserMenu(false)
            nav('/cardcreator')
        }
        else if (id === '4') {
            setLayerMenu(false)
            setUserMenu(false)
            nav('/login')
        }
        else if (id === '5') {
            setLayerMenu(false)
            setUserMenu(false)
            nav('/registration')
        }
        else if (id === '6') {
            let darkModeString = localStorage.getItem("DarkMode")
            let darkModeBool = (darkModeString === "true")
            setDarkMode(!darkModeBool)
            localStorage.setItem("DarkMode", !darkModeBool)
        }
        else if (id === '7') {
            setLayerMenu(false)
            setLoggedUserMenu(false)
            nav('/settings')
        }
        else if (id === 'logout') {
            setLayerMenu(false)
            setLoggedUserMenu(false)
            setActiveSession(null)
            logout()
        }
        else
            console.log("Dark Mode Activated")

    };

    const logout = () => {
        gc.supabase.auth.signOut()
            .then(({ error }) => {
                if (error === null) {
                    // alert("You have successfully logged out")
                    gc.setIsEditing(false)
                    gc.setWipDeck({
                        authorID: "",
                        cards: [],
                        coverCard: {
                            image_uris: {
                                art_crop: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
                            }
                        },
                        deckID: "",
                        description: "",
                        formatTag: "",
                        tags: [],
                        title: ""
                    })
                    saveToLocalStorage("wipDeck", gc.wipDeck)
                    setActiveSession(null)
                    localStorage.removeItem("userName")
                    setDarkMode(current => !current)
                    localStorage.removeItem("DarkMode")
                    nav('/')
                }
                else {
                    alert(error)
                }
            })

    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true)
        return () => {
            document.addEventListener("click", handleClickOutside, true)
        }
    }, [wrapperRef]);

    return (

        <div className={`NavBarContainer ${darkMode ? "NavBarContainerDark" : ''}`}>
            <Link to={"/"}
                className="LogoContainer">
                <img
                    src={Logo_Star}
                    alt="logo"
                    className="Logo"
                />
                {!darkMode &&
                    <img
                        src={Logo_Name}
                        alt="logo"
                        className="Logo"
                        id="Logo-responsive"
                    />
                }
                {darkMode &&
                    <img
                        src={Logo_Name_Dark}
                        alt="logo"
                        className="Logo"
                        id="Logo-responsive"
                    />
                }
            </Link>

            <div className="IconContainer">
                {/* <div id="Searchbar-responsive"> */}
                <div id="Searchbar">
                    {gc.hasSearchBar &&
                        <SearchBar type="global" />
                    }</div>
                <img src={SearchGlass}
                    alt="SearchGlass"
                    className="SearchIcon"
                    id="Searchicon-responsive"

                />
                {!darkMode &&
                    <img src={LayerIcon} alt="LayerIcon" className={`Icons ${layerShadow ? "LayerIcon" : ''}`} onMouseEnter={() => setLayerShadow(true)} onMouseLeave={() => setLayerShadow(false)} onClick={onClickHandler}></img>
                }
                {darkMode &&
                    <img src={LayerIconWhite} alt="LayerIcon" className={`Icons ${layerShadow ? "LayerIcon" : ''}`} onMouseEnter={() => setLayerShadow(true)} onMouseLeave={() => setLayerShadow(false)} onClick={onClickHandler}></img>
                }
                {openLayerMenu &&
                    <div className="LayerMenu" ref={wrapperRef}>
                        {/* <div id={'1'} className="MenuItems" onClick={handleClose}>Deck Library</div> */}
                        <div id={'2'} className="MenuItems" onClick={handleClose}>{(!gc.isEditing && "New Deck") || "Deck Editor"}</div>
                        <div id={'3'} className="MenuItems" onClick={handleClose}>New Card</div>
                    </div>
                }
                {!darkMode &&
                    <img src={UsersIcon} alt="UsersIcon" className={`Icons ${userShadow ? "UserIcon" : ''}`} onMouseEnter={() => setUserShadow(true)} onMouseLeave={() => setUserShadow(false)} onClick={onClickHandler}></img>
                }
                {darkMode &&
                    <img src={UsersIconWhite} alt="UsersIcon" className={`Icons ${userShadow ? "UserIcon" : ''}`} onMouseEnter={() => setUserShadow(true)} onMouseLeave={() => setUserShadow(false)} onClick={onClickHandler}></img>
                }
                <div style={{marginLeft: "2px"}}>{name}</div>
                {openUserMenu &&
                    <div>
                        <div className="UserMenu" ref={wrapperRef}>
                            <div id={'4'} className="MenuItems" onClick={handleClose}>Login</div>
                            <div id={'5'} className="MenuItems" onClick={handleClose}>Register</div>
                            <div id={'6'} className="MenuItems" onClick={handleClose}>Dark Mode</div>
                        </div>
                    </div>
                }
                {loggedInUserMenu &&
                    <div>
                        <div className="UserMenu" ref={wrapperRef}>
                            {/* <div className="MenuText">Hello {name}</div> */}
                            <div id={'0'} className="MenuItems" onClick={handleClose}>Profile</div>
                            <div id={'7'} className="MenuItems" onClick={handleClose}>Settings</div>
                            <div id={'6'} className="MenuItems" onClick={handleClose}>Dark Mode</div>
                            <div id={'logout'} className="MenuItems" onClick={handleClose}>Signout</div>
                        </div>
                    </div>
                }
            </div>

        </div>

    );
};

export default Navbar;