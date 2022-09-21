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

    const [hasSearchBar, setSearchBar] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const [searchType, setSearchType] = useState("DEF")

    const [forceSearch, setForceSearch] = useState("")

    const [wipDeck, setWipDeck] = useState({
        authorID: "",
        cards: [],
        coverCard: "",
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
                searchQuery,
                setSearchQuery,
                searchType,
                setSearchType,
                wipDeck,
                setWipDeck,
                User,
                supabase,

            }}
        >
            {/* {console.log(env)} */}
            {children}
        </GlobalContext.Provider>

    );
};