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

    // Global Function Below

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

            }}
        >
            {/* {console.log(env)} */}
            {children}
        </GlobalContext.Provider>

    );
};