import React, { useContext, useState, useEffect } from 'react'
import './User-Registration.css'
import { Link } from 'react-router-dom'
import EyePassword from '../images/EyePassword.png'
import EyePassword2 from '../images/HiddenEyePassword.png'
import { GlobalContext } from '../context/GlobalContext'
import ReactTooltip from "react-tooltip";

const Registration = () => {

  const { User } = useContext(GlobalContext)
  const { supabase } = useContext(GlobalContext)

  const [underlineActiveUser, setUnderline] = useState(false)
  const [isShowing, setIsShowing] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)
  const [inputs, setInputs] = useState({});

  const handlePasswordClick = () => {
      
    isShowing ? setIsShowing(false) : setIsShowing(true)

  };

  const handleChange = (event) => {

    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({...values, [name]: value}))
  
  }

  const handleSubmit = (event) => {

    event.preventDefault()
    QueryRegister()

    // console.log(inputs)
    // User.email = inputs.email
    // User.name = inputs.fullname
    // User.username = inputs.username
    // User.password = inputs.password
    // console.log(User)
  
  }

  async function QueryRegister(){
    
    const { user, session, error } = await supabase.auth.signUp({
      email: inputs.email,
      password: inputs.password,
    })

    console.log(user)

  }

    useEffect(()=>{

      console.log(User)
        
    },[User])

  return (

    /* Login & Registration share CSS properties (Login-Registration.css) since they have the same foundational format */
    <div className='LoginContainer'>
      <div className='LeftContainer'/>
      <div className='RightContainer'>
        <div className='RegistrationTitle'>Register</div>
        <Link to='/login' className={`ActiveUserLink ${underlineActiveUser ? "ActiveUserLinkAlt" : ''}`} onMouseEnter={() => setUnderline(true)} onMouseLeave={() => setUnderline(false)}>Already have an account?</Link>
      
        <form className='FormContainer' onSubmit={handleSubmit}>
          <div className='InputTitles'>Full Name</div>
          <input
            type="text"
            name="fullname"
            value={inputs.fullname || ""}
            onChange={handleChange}
            className="RegistrationInputs"
            maxLength={35}
          />
          <div className='InputTitles'>Email</div>
          <input
            type="email"
            name="email"
            value={inputs.email || ""}
            onChange={handleChange}
            className="RegistrationInputs"
            maxLength={35}
          />
          {/* <div className='InputTitles'>Username</div>
          <input
            type="text"
            name="username"
            value={inputs.username || ""}
            onChange={handleChange}
            className="RegistrationInputs"
            maxLength={35}
          /> */}
          <div className='InputTitles'>Password</div>
          <input
            type={isShowing ? "text" : "password"}
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
            className="RegistrationInputs"
            minLength={8}
            maxLength={35}
          />
          {!isShowing &&
            <img src={EyePassword2} alt='EyeIcon2' className='RegEyeIconAlt' data-for='passReqs' data-iscapture="true" onClick={handlePasswordClick}/>
          }
          {isShowing &&
            <img src={EyePassword} alt='EyeIcon' className='RegEyeIcon' data-for='passReqs' data-iscapture="true" onClick={handlePasswordClick}/>
          }
          <input type="submit" className={`SubmitButton ${buttonHover ? "SubmitButtonAlt" : ''}`} onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)}/>

          <ReactTooltip id='passReqs' place='right' type='light' effect='solid' multiline='true'>
            <span>Password Requirements:<br /><br />• Password must be a minumum of 8 characters<br />• Password must include a number</span>
          </ReactTooltip>

        </form>
      </div>

    </div>

  )}

export default Registration