import { createContext, useState } from 'react'

export const GlobalContext = createContext()

export const GlobalProvider = ( {children} ) => {

    //Variables & Functions

    const [hasSearchBar, setSearchBar] = useState(false)

    return (

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