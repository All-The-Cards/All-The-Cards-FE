import { React, useState, useEffect, useContext } from 'react';
import Footer from '../components/Footer/Footer';
import { GlobalContext } from "../context/GlobalContext";

const CardCreator = (props) => {

  const [state, setState] = useState({

  })

  const gc = useContext(GlobalContext)

  useEffect(() => {
    document.title = "Card Creator"
    gc.setSearchBar(props.hasSearchBar)
  }, [])


  return (

    <div>
      CardCreator

      {/* Place code above this... */}
      <Footer />
    </div>

  )
}

export default CardCreator