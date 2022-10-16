import { createContext, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export const GlobalContext = createContext()

//export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_API_KEY)

export const GlobalProvider = ({ children }) => {

    // Object Variables Below

    // Global Variables Below

    const [devMode, setDevMode] = useState(false)

    const [hasSearchBar, setSearchBar] = useState(true)

    const [searchType, setSearchType] = useState("DEF")
    const [searchQuery, setSearchQuery] = useState("")

    const [wipDeck, setWipDeck] = useState({
        authorID: "",
        cards: [],
        coverCard: "",
        deckID: "",
        description: "",
        formatTag: "",
        tags: [],
        title: ""
    })

    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_API_KEY)
    const [activeSession, setActiveSession] = useState(null)
    const [activeUser, setUser] = useState(null)
    const [name, setName] = useState("");

    // Global Function Below
    const getName = () => {

        if (activeSession !== null && Object.keys(activeSession.user.user_metadata).length !== 0) {
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
                getName

            }}
        >
            {/* {console.log(env)} */}
            {children}
        </GlobalContext.Provider>

    );
};