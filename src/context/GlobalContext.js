import { createContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import env from "react-dotenv";

export const GlobalContext = createContext()

export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_API_KEY)

export const GlobalProvider = ( {children} ) => {

    // Object Variables Below

    let User = {

        email: '',
        name: '',
        username: '',
        password: '',

    };

    // Global Variables Below

    const [hasSearchBar, setSearchBar] = useState(true)

    // const supabaseUrl = process.env.SUPABASE_URL
    // const supabaseAnonKey = process.env.API_KEY

    // Global Function Below

    return (

        // Any variable or function must be placed below
		<GlobalContext.Provider
			value={{

				hasSearchBar,
                setSearchBar,
                User,
                supabase,
    
			}}
		>
            {/* {console.log(env)} */}
            {children}
        </GlobalContext.Provider>

	);
};