import { isDisabled } from '@testing-library/user-event/dist/utils'
import { React, useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
//import { Link } from 'react-router-dom';
import './Footer.css'

const Footer = () => {

    const { darkMode } = useContext(GlobalContext);

    return (
        
        <div className={`FooterContainer ${darkMode ? "FooterContainerDark" : ''}`}>
            {/* <div className='NavigationBox'>
                <a className='Links' href='/'>Home</a><span> • </span>
                <a className='Links' href='/login'>Login</a><span> • </span>
                <a className='Links' href='/registration'>Register</a><span> • </span>
                <a className='Links' href='/deckeditor'>New Deck</a><span> • </span>
                <a className='Links' href='/cardcreator'>New Card</a>
            </div> */}
            <div className={`Legality ${darkMode ? "LegalityDark" : ''}`}>
                All the Cards is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards.
                Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
            </div>
        </div>

    )
}

export default Footer