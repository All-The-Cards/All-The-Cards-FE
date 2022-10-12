import { React, useState, useEffect, useContext, useRef } from "react";
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from "../../context/GlobalContext";
import Logo_Star from './logo_star.png'
import Logo_Name from './logo_text_marginleft.png'
import SearchBar from "../SearchBar/SearchBar";
import LayerIcon from './layers_icon.png'
import UsersIcon from './users_icon.png'
import * as server from '../../functions/ServerTalk.js'
import SearchGlass from './SearchGlass.png';
import { Link } from "react-router-dom";


const Navbar = () => {

    const nav = useNavigate()
    const wrapperRef = useRef(null)

    // Global Context Variables
    const gc = useContext(GlobalContext);
    const { activeSession, setActiveSession } = useContext(GlobalContext);
    const { activeUser, setUser } = useContext(GlobalContext);
    const [name, setName] = useState("");

    // Variables strickly on the NavBar
    const [layerShadow, setLayerShadow] = useState(false);
    const [userShadow, setUserShadow] = useState(false);
    const [openLayerMenu, setLayerMenu] = useState(false);
    const [openUserMenu, setUserMenu] = useState(false);
    const [loggedInUserMenu, setLoggedUserMenu] = useState(false);

    useEffect(() => {

        if (activeSession === null) {
            let data = localStorage.getItem("sb-pkzscplmxataclyrehsr-auth-token")
            setActiveSession(JSON.parse(data))
            data = localStorage.getItem("userName")
            setName(JSON.parse(data))
        }

    }, []);

    useEffect(() => {
        getName()
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

    const getName = () => {

        if (gc.activeSession && gc.activeSession.user.user_metadata.name) {
            setName(gc.activeSession.user.user_metadata.name.split(" ")[0])
        }
        else {
            setName("User")
        }

    };

    const logout = () => {
        gc.supabase.auth.signOut()
            .then(({ error }) => {
                console.log(error)
                if (error === null) {
                    alert("You have successfully logged out")
                    setActiveSession(null)
                    localStorage.removeItem("userName")
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

        <div className="NavBarContainer">
            <Link to={"/"}
                className="LogoContainer">
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
                <img src={LayerIcon} alt="LayerIcon" className={`Icons ${layerShadow ? "LayerIcon" : ''}`} onMouseEnter={() => setLayerShadow(true)} onMouseLeave={() => setLayerShadow(false)} onClick={onClickHandler}></img>
                {openLayerMenu &&
                    <div className="LayerMenu" ref={wrapperRef}>
                        <div id={'1'} className="MenuItems" onClick={handleClose}>Deck Library</div>
                        <div id={'2'} className="MenuItems" onClick={handleClose}>New Deck</div>
                        <div id={'3'} className="MenuItems" onClick={handleClose}>New Card</div>
                    </div>
                }
                <img src={UsersIcon} alt="UsersIcon" className={`Icons ${userShadow ? "UserIcon" : ''}`} onMouseEnter={() => setUserShadow(true)} onMouseLeave={() => setUserShadow(false)} onClick={onClickHandler}></img>
                {openUserMenu &&
                    <div>
                        <div className="UserMenu" ref={wrapperRef}>
                            <div id={'4'} className="MenuItems" onClick={handleClose}>Login</div>
                            <div id={'5'} className="MenuItems" onClick={handleClose}>Register</div>
                            {/* <div id={'6'} className="MenuItems" onClick={handleClose}>Dark Mode</div> */}
                        </div>
                    </div>
                }
                {loggedInUserMenu &&
                    <div>
                        <div className="UserMenu" ref={wrapperRef}>
                            <div className="MenuText">Hello {name}</div>
                            <div id={'0'} className="MenuItems" onClick={handleClose}>Profile</div>
                            {/* <div id={'6'} className="MenuItems" onClick={handleClose}>Dark Mode</div> */}
                            <div id={'7'} className="MenuItems" onClick={handleClose}>Settings</div>
                            <div id={'logout'} className="MenuItems" onClick={handleClose}>Signout</div>
                        </div>
                    </div>
                }
            </div>

        </div>

    );
};

export default Navbar;