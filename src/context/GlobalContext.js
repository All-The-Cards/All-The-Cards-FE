import { createContext, useState } from 'react'

export const GlobalContext = createContext()

export const GlobalProvider = ( {children} ) => {

    // Global Variables Below

    const [hasSearchBar, setSearchBar] = useState(true)

    // Global Function Below

    return (

        // Any variable or function must be placed below
		<GlobalContext.Provider
			value={{

				hasSearchBar,
                setSearchBar
                
			}}
		>
            {children}
        </GlobalContext.Provider>

	);
};