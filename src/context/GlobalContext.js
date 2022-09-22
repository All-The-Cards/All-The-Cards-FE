import { createContext, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export const GlobalContext = createContext()

//export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_API_KEY)

export const GlobalProvider = ({ children }) => {

    // Object Variables Below

    let User = {

        email: '',
        name: '',
        username: '',
        password: '',

    };

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
                User,
                supabase,
                searchQuery,
                setSearchQuery,
                User,
                supabase,
                devMode,
                setDevMode
    
			}}
		>
            {/* {console.log(env)} */}
            {children}
        </GlobalContext.Provider>

    );
};