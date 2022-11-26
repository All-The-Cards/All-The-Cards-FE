import { React, useContext } from 'react'
//import { Link } from 'react-router-dom';
import './Footer.css'

const Footer = () => {

    return (
        
        <div className="FooterContainer">
            <div className='NavigationBox'>
                <a className='Links' href='/'>Home</a><span> • </span>
                <a className='Links' href='/login'>Login</a><span> • </span>
                <a className='Links' href='/registration'>Register</a><span> • </span>
                <a className='Links' href='/deckeditor'>New Deck</a><span> • </span>
                <a className='Links' href='/cardcreator'>New Card</a>
            </div>
            <div className="Legality">
                All the Cards is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards.
                Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
            </div>
        </div>

    )
}

export default Footer