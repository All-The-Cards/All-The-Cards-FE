import { createContext, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { loadFromLocalStorage } from '../functions/Utilities';

export const GlobalContext = createContext()

//export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_API_KEY)

export const GlobalProvider = ({ children }) => {

    // Object Variables Below

    // Global Variables Below

    const [devMode, setDevMode] = useState(false)
    const [hasSearchBar, setSearchBar] = useState(true)
    const [searchType, setSearchType] = useState("DEF")
    const [searchQuery, setSearchQuery] = useState("")

    let initialDeckState = {
        authorID: "",
        cards: [],
        coverCard: {
            image_uris: {
                art_crop: ""
            }
        }, 
        deckID: "",
        description: "",
        formatTag: "",
        tags: [],
        title: "",
        commanderSlot: {
            name: ""
        },
    }

    let loadedWipDeckData = loadFromLocalStorage("wipDeck")

    if (loadedWipDeckData) {
        initialDeckState = loadedWipDeckData
    }

    const [wipDeck, setWipDeck] = useState(initialDeckState)

    const [showActiveDeckList, setShowActiveDeckList] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_API_KEY)
    const [activeSession, setActiveSession] = useState(JSON.parse(localStorage.getItem("sb-pkzscplmxataclyrehsr-auth-token")))
    const [activeUser, setUser] = useState(null)
    const [name, setName] = useState("");
    const [darkMode, setDarkMode] = useState(localStorage.getItem("DarkMode"))

    // Global Function Below
    const getName = () => {

        if (activeSession && activeSession.user.user_metadata) {
            setName(activeSession.user.user_metadata.name.split(" ")[0])
        }
        else {
            setName("User")
        }

    };


    return (

        // Any variable or function must be placed below
        <GlobalContext.Provider
            value={{

                hasSearchBar,
                setSearchBar,
                searchType,
                setSearchType,
                wipDeck,
                setWipDeck,
                supabase,
                searchQuery,
                setSearchQuery,
                devMode,
                setDevMode,
                activeSession,
                setActiveSession,
                activeUser,
                setUser,
                name,
                setName,
                getName,
                isEditing,
                setIsEditing,
                darkMode,
                setDarkMode

            }}
        >
            {/* {console.log(env)} */}
            {children}
        </GlobalContext.Provider>

    );
};